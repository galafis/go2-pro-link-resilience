# Worked experiments · Experimentos comentados

[README](../README.md)

## English

In the nominal scenario, each 1,000-byte message arrives 100 ms after creation: 80 ms serialization plus 20 ms propagation. All eight messages are delivered. The blocking example places a 10,000-byte high-priority message before a 10-byte message on an 8 kbps link. The large message expires at 1,000 ms; only then can the small message start, arriving at 1,010 ms.

For each experiment below, run the command and compare the JSON with the committed expected report. Change one assumption at a time; keep the original input as a separate file. Status is an interpretation of this model, not physical approval.

## Português

No cenário nominal, cada mensagem de 1.000 bytes chega 100 ms após a criação: 80 ms de serialização e 20 ms de propagação. As oito mensagens são entregues. O exemplo de bloqueio coloca uma mensagem de 10.000 bytes de alta prioridade antes de uma de 10 bytes em conexão de 8 kbps. A maior expira em 1.000 ms; só então a menor inicia, chegando em 1.010 ms.

Em cada experimento abaixo, execute o comando e compare o JSON com o relatório esperado versionado. Altere uma hipótese por vez e preserve a entrada original em arquivo separado. O estado é uma interpretação deste modelo, não aprovação física.

## Continuous link · Conexão contínua

```sh
node scripts/analyze.mjs examples/nominal.json experiment.report.json
```

[Input / Entrada](../examples/nominal.json) · [Expected / Esperado](../examples/nominal.report.json) · `complete`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Delivered messages / Mensagens entregues  | 8                               |
| Delivery fraction / Fração entregue       | 100 %                           |
| Observed p95 delay / Atraso p95 observado | 100 ms                          |
| Delivered bytes / Bytes entregues         | 8000 B                          |

## Intermittent link · Conexão intermitente

```sh
node scripts/analyze.mjs examples/outage.json experiment.report.json
```

[Input / Entrada](../examples/outage.json) · [Expected / Esperado](../examples/outage.report.json) · `complete`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Delivered messages / Mensagens entregues  | 8                               |
| Delivery fraction / Fração entregue       | 100 %                           |
| Observed p95 delay / Atraso p95 observado | 1990 ms                         |
| Delivered bytes / Bytes entregues         | 8000 B                          |

## Expired messages · Mensagens expiradas

```sh
node scripts/analyze.mjs examples/expiry.json experiment.report.json
```

[Input / Entrada](../examples/expiry.json) · [Expected / Esperado](../examples/expiry.report.json) · `review-notes`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Delivered messages / Mensagens entregues  | 0                               |
| Delivery fraction / Fração entregue       | 0 %                             |
| Observed p95 delay / Atraso p95 observado | null ms                         |
| Delivered bytes / Bytes entregues         | 0 B                             |

- `UNDELIVERED`: Messages not delivered in this model: 8. / Mensagens não entregues neste modelo: 8.

## No link windows · Sem janelas de conexão

```sh
node scripts/analyze.mjs examples/absent.json experiment.report.json
```

[Input / Entrada](../examples/absent.json) · [Expected / Esperado](../examples/absent.report.json) · `review-notes`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Delivered messages / Mensagens entregues  | 0                               |
| Delivery fraction / Fração entregue       | 0 %                             |
| Observed p95 delay / Atraso p95 observado | null ms                         |
| Delivered bytes / Bytes entregues         | 0 B                             |

- `UNDELIVERED`: Messages not delivered in this model: 8. / Mensagens não entregues neste modelo: 8.

## Head-of-line blocking · Bloqueio pelo primeiro da fila

```sh
node scripts/analyze.mjs examples/blocking.json experiment.report.json
```

[Input / Entrada](../examples/blocking.json) · [Expected / Esperado](../examples/blocking.report.json) · `review-notes`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Delivered messages / Mensagens entregues  | 1                               |
| Delivery fraction / Fração entregue       | 50 %                            |
| Observed p95 delay / Atraso p95 observado | 1010 ms                         |
| Delivered bytes / Bytes entregues         | 10 B                            |

- `UNDELIVERED`: Messages not delivered in this model: 1. / Mensagens não entregues neste modelo: 1.
