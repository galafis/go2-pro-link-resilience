import { svg, label, esc, fmt, text } from './ui.js';
export const interpretation = {
  en: 'Link windows, rates and delays are explicit assumptions. The model uses one non-preemptive transmitter, head-of-line blocking and no retries. It does not send commands or estimate radio propagation, acknowledgments or physical link reliability.',
  pt: 'Janelas, taxas e atrasos são hipóteses explícitas. O modelo usa um transmissor sem preempção, bloqueio pelo primeiro da fila e nenhuma retransmissão. Não envia comandos nem estima propagação de rádio, confirmações ou confiabilidade física da conexão.',
};
export const cursorMax = (r) => r.records.length - 1;
export function render(r, lang, cursor) {
  const rows = r.records.slice(0, 14),
    max = Math.max(1, ...rows.map((t) => t.arrivalMs ?? t.expiryMs)),
    x = (t) => 130 + (t / max) * 580,
    h = Math.max(300, 80 + rows.length * 23);
  let c = label(
    20,
    24,
    text('Message delivery timeline (ms)', 'Linha do tempo de entrega (ms)', lang),
  );
  r.windows
    .filter((w) => w.startMs < max)
    .forEach((w) => {
      c += `<rect x="${x(w.startMs)}" y="35" width="${x(Math.min(max, w.endMs)) - x(w.startMs)}" height="${h - 75}" fill="#e2ece8"/>`;
    });
  rows.forEach((t, i) => {
    const y = 50 + i * 23;
    c += label(120, y + 4, t.id, 'text-anchor="end" font-size="11"');
    c += `<line x1="${x(t.createdMs)}" x2="${x(t.arrivalMs ?? t.expiryMs)}" y1="${y}" y2="${y}" stroke="${t.status === 'delivered' ? '#236f70' : '#b2454a'}" stroke-width="${i === cursor ? 6 : 3}"/>`;
    if (t.startMs !== null) c += `<circle cx="${x(t.startMs)}" cy="${y}" r="4" fill="#203b4e"/>`;
  });
  c += label(130, h - 15, '0') + label(710, h - 15, fmt(max, lang), 'text-anchor="end"');
  const t = r.records[cursor];
  return (
    svg(
      c,
      text(
        'Link windows and message outcomes',
        'Janelas de conexão e resultados de mensagens',
        lang,
      ),
      h,
    ) +
    `<p class="visual-note"><strong>${esc(t.id)}</strong> · ${esc(t.status === 'delivered' ? text('Delivered', 'Entregue', lang) : text('Undelivered', 'Não entregue', lang))} · ${esc(text('End-to-end delay', 'Atraso de ponta a ponta', lang))}: ${fmt(t.latencyMs, lang)} ms. ${esc(text('Preview: first 14 messages; shaded areas are link windows.', 'Prévia: primeiras 14 mensagens; áreas sombreadas são janelas de conexão.', lang))}</p>`
  );
}
