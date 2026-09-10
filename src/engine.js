import {
  base,
  object,
  number,
  integer,
  list,
  identifier,
  unique,
  requireThat,
  metric,
  finding,
  report,
  round,
} from './validation.js';
export function validate(s) {
  base(s, ['ttlScale', 'messages', 'windows']);
  number(s.ttlScale, 'ttlScale', 0.1, 10);
  list(s.messages, 'messages', 1, 1000);
  s.messages.forEach((m) =>
    object(m, 'message', ['id', 'createdMs', 'sizeBytes', 'ttlMs', 'priority']),
  );
  unique(
    s.messages.map((m) => m.id),
    'messages',
  );
  s.messages.forEach((m) => {
    object(m, 'message', ['id', 'createdMs', 'sizeBytes', 'ttlMs', 'priority']);
    identifier(m.id, 'id');
    number(m.createdMs, 'createdMs', 0, 86400000);
    integer(m.sizeBytes, 'sizeBytes', 1, 10000000);
    number(m.ttlMs, 'ttlMs', 1, 3600000);
    integer(m.priority, 'priority', 0, 100);
  });
  list(s.windows, 'windows', 0, 100);
  s.windows.forEach((w) => {
    object(w, 'window', ['startMs', 'endMs', 'kbps', 'latencyMs']);
    number(w.startMs, 'startMs', 0, 86400000);
    number(w.endMs, 'endMs', 1, 100000000);
    number(w.kbps, 'kbps', 0.001, 1000000);
    number(w.latencyMs, 'latencyMs', 0, 3600000);
    requireThat(
      w.endMs > w.startMs,
      'WINDOW',
      'Each window must have positive duration.',
      'Cada janela deve ter duração positiva.',
    );
  });
  const windows = [...s.windows].sort((a, b) => a.startMs - b.startMs);
  for (let i = 1; i < windows.length; i++)
    requireThat(
      windows[i].startMs >= windows[i - 1].endMs,
      'OVERLAP',
      'Link windows cannot overlap.',
      'Janelas de conexão não podem se sobrepor.',
    );
  return s;
}
export function run(s) {
  validate(s);
  const windows = [...s.windows].sort((a, b) => a.startMs - b.startMs),
    pending = s.messages
      .map((m) => ({ ...m, expiryMs: m.createdMs + m.ttlMs * s.ttlScale }))
      .sort((a, b) => a.createdMs - b.createdMs || a.id.localeCompare(b.id, 'en'));
  let time = pending[0].createdMs;
  const records = [],
    queue = [];
  const reject = (m, reason) =>
    records.push({
      id: m.id,
      createdMs: m.createdMs,
      expiryMs: round(m.expiryMs),
      status: 'undelivered',
      reason,
      startMs: null,
      endMs: null,
      arrivalMs: null,
      latencyMs: null,
      sizeBytes: m.sizeBytes,
    });
  while (pending.length || queue.length) {
    while (pending.length && pending[0].createdMs <= time) queue.push(pending.shift());
    for (let i = queue.length - 1; i >= 0; i--)
      if (queue[i].expiryMs <= time) {
        reject(queue[i], 'expired');
        queue.splice(i, 1);
      }
    if (!queue.length) {
      if (!pending.length) break;
      time = Math.max(time, pending[0].createdMs);
      continue;
    }
    queue.sort(
      (a, b) =>
        b.priority - a.priority || a.createdMs - b.createdMs || a.id.localeCompare(b.id, 'en'),
    );
    const window = windows.find((w) => w.startMs <= time && w.endMs > time),
      m = queue[0];
    if (window) {
      const transferMs = (m.sizeBytes * 8) / window.kbps,
        endMs = time + transferMs,
        arrivalMs = endMs + window.latencyMs;
      if (endMs <= window.endMs && arrivalMs <= m.expiryMs) {
        queue.shift();
        records.push({
          id: m.id,
          createdMs: m.createdMs,
          expiryMs: round(m.expiryMs),
          status: 'delivered',
          reason: null,
          startMs: round(time),
          endMs: round(endMs),
          arrivalMs: round(arrivalMs),
          latencyMs: round(arrivalMs - m.createdMs),
          sizeBytes: m.sizeBytes,
        });
        time = endMs;
        continue;
      }
    }
    const future = [
      ...windows.filter((w) => w.startMs > time).map((w) => w.startMs),
      ...(window ? [window.endMs] : []),
      ...queue.map((q) => q.expiryMs),
      ...(pending.length ? [pending[0].createdMs] : []),
    ].filter((t) => t > time);
    if (!windows.some((w) => w.endMs > time)) {
      queue.splice(0).forEach((m) => reject(m, 'no-link-window'));
      continue;
    }
    time = Math.min(...future);
  }
  records.sort((a, b) => a.createdMs - b.createdMs || a.id.localeCompare(b.id, 'en'));
  const delivered = records.filter((r) => r.status === 'delivered'),
    findings = [];
  if (delivered.length < records.length)
    findings.push(
      finding(
        'warning',
        'UNDELIVERED',
        `Messages not delivered in this model: ${records.length - delivered.length}.`,
        `Mensagens não entregues neste modelo: ${records.length - delivered.length}.`,
      ),
    );
  const latencies = delivered.map((r) => r.latencyMs).sort((a, b) => a - b),
    p95 = latencies.length ? latencies[Math.ceil(latencies.length * 0.95) - 1] : null;
  return report(
    s,
    'go2-pro-link-resilience',
    [
      metric('delivered', 'Delivered messages', 'Mensagens entregues', delivered.length),
      metric(
        'deliveryPct',
        'Delivery fraction',
        'Fração entregue',
        round((100 * delivered.length) / records.length),
        '%',
      ),
      metric('p95LatencyMs', 'Observed p95 delay', 'Atraso p95 observado', p95, 'ms'),
      metric(
        'bytes',
        'Delivered bytes',
        'Bytes entregues',
        delivered.reduce((v, r) => v + r.sizeBytes, 0),
        'B',
      ),
    ],
    findings,
    records,
    {
      windows: windows.map((w) => ({ ...w })),
      policy: 'non-preemptive priority queue; head-of-line blocking; decimal kbps; no retries',
    },
  );
}
