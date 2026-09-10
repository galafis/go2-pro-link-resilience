import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/engine.js';
const msg = (id, extra = {}) => ({
  id,
  createdMs: 0,
  sizeBytes: 1000,
  ttlMs: 3000,
  priority: 1,
  ...extra,
});
const win = (extra = {}) => ({ startMs: 0, endMs: 10000, kbps: 100, latencyMs: 20, ...extra });
const scenario = (extra = {}) => ({
  schemaVersion: 1,
  scenarioId: 'test',
  source: 'synthetic',
  ttlScale: 1,
  messages: [msg('a')],
  windows: [win()],
  ...extra,
});
test('decimal 100 kbps serializes 1000 bytes in 80 ms plus 20 ms latency', () => {
  const r = run(scenario()).records[0];
  assert.equal(r.endMs, 80);
  assert.equal(r.arrivalMs, 100);
});
test('arrival exactly at expiration is accepted', () =>
  assert.equal(
    run(scenario({ messages: [msg('a', { ttlMs: 100 })] })).records[0].status,
    'delivered',
  ));
test('arrival beyond expiration is not delivered', () =>
  assert.equal(
    run(scenario({ messages: [msg('a', { ttlMs: 99 })] })).records[0].status,
    'undelivered',
  ));
test('transmission ending at window boundary is accepted', () =>
  assert.equal(run(scenario({ windows: [win({ endMs: 80 })] })).records[0].status, 'delivered'));
test('transmission cannot cross a window boundary', () =>
  assert.equal(run(scenario({ windows: [win({ endMs: 79 })] })).records[0].status, 'undelivered'));
test('propagation delay does not occupy the transmitter', () => {
  const r = run(scenario({ messages: [msg('a'), msg('b')] }));
  assert.equal(r.records[1].startMs, 80);
  assert.equal(r.records[0].arrivalMs, 100);
});
test('queued priority is reevaluated after an outage', () => {
  const r = run(
    scenario({
      messages: [msg('a'), msg('b', { createdMs: 100, priority: 5 })],
      windows: [win({ startMs: 500 })],
    }),
  );
  assert.equal(r.records.find((m) => m.id === 'b').startMs, 500);
  assert.equal(r.records.find((m) => m.id === 'a').startMs, 580);
});
test('later priority does not preempt an active transmission', () => {
  const r = run(scenario({ messages: [msg('a'), msg('b', { createdMs: 1, priority: 5 })] }));
  assert.equal(r.records.find((m) => m.id === 'a').startMs, 0);
  assert.equal(r.records.find((m) => m.id === 'b').startMs, 80);
});
test('large head-of-line message blocks a smaller lower priority message', () => {
  const r = run(
    scenario({
      messages: [
        msg('large', { sizeBytes: 10000, ttlMs: 1000, priority: 5 }),
        msg('small', { sizeBytes: 10, ttlMs: 2000 }),
      ],
      windows: [win({ kbps: 8, latencyMs: 0, endMs: 2000 })],
    }),
  );
  assert.equal(r.records.find((m) => m.id === 'large').status, 'undelivered');
  assert.equal(r.records.find((m) => m.id === 'small').startMs, 1000);
});
test('no windows reports every message without an infinite loop', () => {
  const r = run(scenario({ windows: [], messages: [msg('a'), msg('b', { createdMs: 1000 })] }));
  assert.equal(r.records.length, 2);
  assert.equal(r.metrics[0].value, 0);
  assert.equal(r.metrics[2].value, null);
});
test('overlapping windows and zero rates are rejected', () => {
  assert.throws(() => run(scenario({ windows: [win(), win({ startMs: 10 })] })), {
    code: 'OVERLAP',
  });
  assert.throws(() => run(scenario({ windows: [win({ kbps: 0 })] })));
});
test('delivery accounting conserves message identities and bytes', () => {
  const s = scenario({
      messages: Array.from({ length: 100 }, (_, i) =>
        msg('p-' + i, { createdMs: i * 20, priority: i % 4, ttlMs: 100 + i * 10 }),
      ),
    }),
    r = run(s);
  assert.equal(new Set(r.records.map((m) => m.id)).size, 100);
  const delivered = r.records.filter((m) => m.status === 'delivered');
  assert.equal(r.metrics[3].value, delivered.length * 1000);
  delivered.forEach((m) => assert.ok(m.arrivalMs <= m.expiryMs));
});
test('unordered windows normalize to the same result', () => {
  const windows = [win({ startMs: 0, endMs: 100 }), win({ startMs: 1000, endMs: 2000 })];
  assert.deepEqual(run(scenario({ windows })), run(scenario({ windows: [...windows].reverse() })));
});
test('TTL multiplier changes expiration and preserves message payload size', () => {
  const r = run(scenario({ ttlScale: 0.1 }));
  assert.equal(r.records[0].expiryMs, 300);
  assert.equal(r.records[0].sizeBytes, 1000);
});
