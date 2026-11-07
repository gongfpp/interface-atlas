import test from 'node:test';
import assert from 'node:assert/strict';
import { createAtlasSynth } from '../../src/lib/atlas-audio.ts';

function harness(t) {
  const original = globalThis.AudioContext;
  const contexts = [], states = [], errors = [];
  let volume = 20;
  class Context {
    state = 'suspended';
    currentTime = 0;
    destination = {};
    voices = [];
    gain = { value: 0, setTargetAtTime: value => { this.gain.value = value; } };
    resume() { return new Promise((resolve, reject) => { this.resumeNow = () => { if (this.state !== 'closed') this.state = 'running'; resolve(); }; this.failResume = reject; }); }
    constructor() { contexts.push(this); }
    close() { this.state = 'closed'; return Promise.resolve(); }
    createGain() { this.createdGain = true; return { gain: this.gain, connect() {} }; }
    createOscillator() {
      if (this.failOscillator && this.voices.length === 1) throw new Error('device lost');
      const voice = { frequency: {}, connect() {}, start() { this.started = true; }, stop() { this.stopped = true; } };
      this.voices.push(voice); return voice;
    }
  }
  globalThis.AudioContext = Context;
  t.after(() => { if (original === undefined) delete globalThis.AudioContext; else globalThis.AudioContext = original; });
  const synth = createAtlasSynth({ volume: () => volume, onState: state => states.push(state), onError: () => errors.push('error') });
  t.after(synth.stop);
  return { synth, contexts, states, errors, volume: value => { volume = value; synth.updateVolume(); } };
}

test('启动后立即离开：晚完成的 resume 不得恢复声音或报错，按钮可重新启动', async t => {
  const h = harness(t), pending = h.synth.toggle(), old = h.contexts[0];
  h.synth.stop();
  assert.equal(h.states.at(-1), 'idle');
  const next = h.synth.toggle(), current = h.contexts[1];
  current.resumeNow(); await next;
  old.resumeNow(); await pending;
  assert.equal(old.createdGain, undefined);
  assert.equal(current.voices.length, 3);
  assert.equal(h.states.at(-1), 'playing');
  assert.deepEqual(h.errors, []);
});

test('已取消的启动失败不能停止新一轮播放', async t => {
  const h = harness(t), pending = h.synth.toggle(), old = h.contexts[0];
  h.synth.stop();
  const next = h.synth.toggle(), current = h.contexts[1];
  current.resumeNow(); await next;
  old.failResume(new Error('cancelled')); await pending;
  assert.equal(h.states.at(-1), 'playing');
  assert.equal(current.state, 'running');
  assert.deepEqual(h.errors, []);
});

test('启动中途失败会停止已创建的声部，之后仍可重试', async t => {
  const h = harness(t), pending = h.synth.toggle(), context = h.contexts[0];
  context.failOscillator = true; context.resumeNow(); await pending;
  assert.ok(context.voices.every(voice => voice.stopped));
  assert.equal(context.state, 'closed');
  assert.equal(h.states.at(-1), 'idle');
  assert.equal(h.errors.length, 1);
  const retry = h.synth.toggle(); h.contexts[1].resumeNow(); await retry;
  assert.equal(h.states.at(-1), 'playing');
});

test('音量零保持静音；调整和反复停止不残留声部', async t => {
  const h = harness(t); h.volume(0);
  const pending = h.synth.toggle(), context = h.contexts[0];
  context.resumeNow(); await pending;
  assert.equal(context.gain.value, 0);
  h.volume(100); assert.equal(context.gain.value, .12);
  await h.synth.toggle(); h.synth.stop();
  assert.ok(context.voices.every(voice => voice.stopped));
  assert.equal(h.states.at(-1), 'idle');
});

test('浏览器拒绝创建音频上下文时恢复按钮并显示一次错误', async t => {
  const h = harness(t);
  globalThis.AudioContext = class { constructor() { throw new Error('unavailable'); } };
  await h.synth.toggle();
  assert.equal(h.states.at(-1), 'idle');
  assert.equal(h.errors.length, 1);
});
