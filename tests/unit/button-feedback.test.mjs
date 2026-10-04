import test from 'node:test';
import assert from 'node:assert/strict';
import { createButtonFeedback, buttonFeedbackText } from '../../src/lib/button-feedback.ts';

function setup() {
  const jobs = [], changes = [];
  const feedback = createButtonFeedback((finish, delay) => {
    const job = { finish, delay, cancelled: false };
    jobs.push(job);
    return () => { job.cancelled = true; };
  });
  const unsubscribe = feedback.subscribe(() => changes.push(feedback.getSnapshot()));
  return { feedback, jobs, changes, unsubscribe };
}

test('本地按钮模拟由触发开始，经忙碌态完成，并可再次运行', () => {
  const { feedback, jobs, changes } = setup();
  assert.equal(feedback.getSnapshot(), 'idle');
  feedback.start();
  assert.equal(feedback.getSnapshot(), 'pending');
  assert.equal(jobs[0].delay, 900);
  jobs[0].finish();
  assert.equal(feedback.getSnapshot(), 'success');
  feedback.start();
  assert.equal(jobs.length, 2);
  jobs[1].finish();
  assert.deepEqual(changes, ['pending', 'success', 'pending', 'success']);
});

test('连续触发只运行一次；取消会停止计时并拒绝晚到的成功', () => {
  const { feedback, jobs } = setup();
  feedback.start(); feedback.start(); feedback.start();
  assert.equal(jobs.length, 1);
  feedback.cancel();
  assert.equal(jobs[0].cancelled, true);
  assert.equal(feedback.getSnapshot(), 'cancelled');
  jobs[0].finish();
  assert.equal(feedback.getSnapshot(), 'cancelled');
});

test('取消后重试不受旧请求回调影响，最新模拟仍能完成', () => {
  const { feedback, jobs } = setup();
  feedback.start(); feedback.cancel(); feedback.start();
  jobs[0].finish();
  assert.equal(feedback.getSnapshot(), 'pending');
  jobs[1].finish();
  assert.equal(feedback.getSnapshot(), 'success');
});

test('重置未完成操作回到初始状态；旧回调不能复活结果', () => {
  const { feedback, jobs } = setup();
  feedback.start(); feedback.reset();
  assert.equal(jobs[0].cancelled, true);
  assert.equal(feedback.getSnapshot(), 'idle');
  jobs[0].finish();
  assert.equal(feedback.getSnapshot(), 'idle');
});

test('最后一个预览卸载时取消任务，切回不会卡在处理中', () => {
  const { feedback, jobs, unsubscribe } = setup();
  feedback.start(); unsubscribe();
  assert.equal(jobs[0].cancelled, true);
  assert.equal(feedback.getSnapshot(), 'cancelled');
  const returned = [];
  const stop = feedback.subscribe(() => returned.push(feedback.getSnapshot()));
  jobs[0].finish();
  assert.deepEqual(returned, []);
  feedback.start(); jobs[1].finish();
  assert.deepEqual(returned, ['pending', 'success']);
  stop();
});

test('仍有预览订阅时不误取消；完成状态在风格切换后可继续查看', () => {
  const { feedback, jobs, unsubscribe } = setup();
  const stopOther = feedback.subscribe(() => {});
  feedback.start(); unsubscribe();
  assert.equal(jobs[0].cancelled, false);
  jobs[0].finish(); stopOther();
  assert.equal(feedback.getSnapshot(), 'success');
  const stop = feedback.subscribe(() => {});
  assert.equal(feedback.getSnapshot(), 'success');
  feedback.cancel();
  assert.equal(feedback.getSnapshot(), 'cancelled');
  stop();
});

test('空闲或重复取消是可回退状态，不生成计时任务', () => {
  const { feedback, jobs, changes } = setup();
  feedback.cancel(); feedback.cancel();
  assert.equal(jobs.length, 0);
  assert.deepEqual(changes, ['cancelled']);
  feedback.reset(); feedback.reset();
  assert.deepEqual(changes, ['cancelled', 'idle']);
});

test('所有反馈都有中英两份，并明确模拟不会提交真实数据', () => {
  for (const state of ['idle', 'pending', 'success', 'cancelled']) {
    assert.match(buttonFeedbackText(state, 'zh'), /[\u4e00-\u9fff]/);
    assert.doesNotMatch(buttonFeedbackText(state, 'en'), /[\u4e00-\u9fff]/);
  }
  assert.match(buttonFeedbackText('idle', 'en'), /No real data/);
  assert.match(buttonFeedbackText('success', 'zh'), /没有提交真实数据/);
  assert.match(buttonFeedbackText('pending', 'en'), /cancel/);
});

test('真实按钮位移类在编译后受 prefers-reduced-motion 安全门控', async () => {
  const { readFileSync } = await import('node:fs');
  const { compile } = await import('tailwindcss');
  const sources = ['../../src/islands/demos/button.tsx', '../../src/islands/style-variants/button.tsx'];
  const movement = [...new Set(sources.flatMap(path => readFileSync(new URL(path, import.meta.url), 'utf8').split(/[\s`]+/)
    .filter(token => /enabled:(?:active|hover|focus-visible):(?:-?translate-[xy]|scale)/.test(token))))];
  assert.ok(movement.length >= 4);
  for (const token of movement) assert.ok(token.startsWith('motion-safe:'), `位移未受减弱动效偏好保护：${token}`);
  const compiler = await compile('@theme { --spacing: 0.25rem; } @tailwind utilities;');
  for (const token of movement) {
    const css = compiler.build([token]);
    assert.match(css, /@media \(prefers-reduced-motion: no-preference\)/);
    assert.match(css, /(?:translate|scale):/);
  }
});
