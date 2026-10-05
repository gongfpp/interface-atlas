import test from 'node:test';
import assert from 'node:assert/strict';
import {createClipboardWriter} from '../../src/islands/shared/useClipboard.ts';

function harness(t) {
  t.mock.timers.enable({apis:['setTimeout']});
  const results=[], requests=[], copied=[];
  const writer=createClipboardWriter(value=>results.push(value), text=>new Promise((resolve,reject)=>requests.push({text,resolve,reject})));
  t.after(()=>writer.cancel());
  return {writer,results,requests,copied,copy:text=>writer.copy(text,()=>copied.push(text))};
}

test('同文本最新复制成功后，旧失败不能覆盖成功反馈', async t => {
  const h=harness(t), first=h.copy('同一说明'), second=h.copy('同一说明');
  h.requests[1].resolve(); await second;
  h.requests[0].reject(new Error('old denial')); await first;
  assert.deepEqual(h.results.at(-1),{text:'同一说明',state:'copied'});
  assert.deepEqual(h.copied,['同一说明']);
  t.mock.timers.tick(2000); assert.equal(h.results.at(-1),null);
});

test('最新失败不会被旧成功掩盖，仍可看到手动复制反馈', async t => {
  const h=harness(t), first=h.copy('旧说明'), second=h.copy('新说明');
  h.requests[1].reject(new Error('new denial')); await second;
  h.requests[0].resolve(); await first;
  assert.deepEqual(h.results.at(-1),{text:'新说明',state:'error'}); assert.deepEqual(h.copied,[]);
});

test('切换方案时旧请求晚完成，不能清除新文本的正确反馈', async t => {
  const h=harness(t), first=h.copy('方案 A'), second=h.copy('方案 B');
  h.requests[1].resolve(); await second;
  h.requests[0].resolve(); await first;
  assert.deepEqual(h.results.at(-1),{text:'方案 B',state:'copied'}); assert.deepEqual(h.copied,['方案 B']);
});

test('再次复制撤销旧提示计时器，保留最新请求的完整反馈时间', async t => {
  const h=harness(t);const first=h.copy('A');h.requests[0].resolve();await first;
  t.mock.timers.tick(1500);
  const second=h.copy('B');h.requests[1].resolve();await second;
  t.mock.timers.tick(500);assert.deepEqual(h.results.at(-1),{text:'B',state:'copied'});
  t.mock.timers.tick(1500);assert.equal(h.results.at(-1),null);
});

test('卸载取消未完成请求和计时器；重新挂载后仍可复制', async t => {
  const h=harness(t), pending=h.copy('离开前的说明');h.writer.cancel();const count=h.results.length;
  h.requests[0].resolve();await pending;t.mock.timers.tick(5000);
  assert.equal(h.results.length,count);assert.deepEqual(h.copied,[]);
  const next=h.copy('返回后的说明');h.requests[1].resolve();await next;
  h.writer.cancel();const after=h.results.length;t.mock.timers.tick(5000);assert.equal(h.results.length,after);
  assert.deepEqual(h.copied,['返回后的说明']);
});

test('同步拒绝剪贴板访问也显示失败，之后能正常重试', async t => {
  t.mock.timers.enable({apis:['setTimeout']});let blocked=true,last;
  const writer=createClipboardWriter(value=>last=value,()=>{if(blocked)throw new Error('blocked');return Promise.resolve();});t.after(()=>writer.cancel());
  await writer.copy('说明',()=>{});assert.deepEqual(last,{text:'说明',state:'error'});
  blocked=false;await writer.copy('说明',()=>{});assert.deepEqual(last,{text:'说明',state:'copied'});
});
