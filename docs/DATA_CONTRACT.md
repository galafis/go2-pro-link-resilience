# Data contract · Contrato de dados

[README](../README.md) · [JSON Schema](../schemas/scenario.schema.json)

## Envelope

| Field · Campo   | Contract · Contrato                                                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaVersion` | Exactly 1 / Exatamente 1                                                                                                                                                      |
| `scenarioId`    | 1–64 lowercase letters, digits, dashes or underscores; first character alphanumeric / 1–64 letras minúsculas, dígitos, hífens ou sublinhados; primeiro caractere alfanumérico |
| `source`        | `synthetic` or `manual`; manual is not verified measurement provenance / `synthetic` ou `manual`; manual não comprova origem medida                                           |

## Domain fields · Campos do domínio

| Field · Campo | English                                                                                                      | Português                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `ttlScale`    | Multiplier from 0.1 to 10 applied to every message lifetime.                                                 | Multiplicador de 0,1 a 10 aplicado à validade de cada mensagem.                                                      |
| `messages`    | 1–1,000 unique coded ids with createdMs, sizeBytes, ttlMs and integer priority. No message text is accepted. | 1–1.000 ids codificados únicos com createdMs, sizeBytes, ttlMs e prioridade inteira. Texto da mensagem não é aceito. |
| `windows`     | 0–100 non-overlapping intervals with startMs, endMs, positive kbps and nonnegative latencyMs.                | 0–100 intervalos sem sobreposição com startMs, endMs, kbps positivo e latencyMs não negativo.                        |

## Nested fields and bounds · Campos aninhados e limites

| Path · Caminho         | Type / bounds · Tipo / limites |
| ---------------------- | ------------------------------ |
| `schemaVersion`        | constant 1                     |
| `scenarioId`           | string                         |
| `source`               | synthetic / manual             |
| `ttlScale`             | number [0.1, 10]               |
| `messages`             | array [1–1000 items / itens]   |
| `messages[].id`        | string                         |
| `messages[].createdMs` | number [0, 86400000]           |
| `messages[].sizeBytes` | integer [1, 10000000]          |
| `messages[].ttlMs`     | number [1, 3600000]            |
| `messages[].priority`  | integer [0, 100]               |
| `windows`              | array [0–100 items / itens]    |
| `windows[].startMs`    | number [0, 86400000]           |
| `windows[].endMs`      | number [1, 100000000]          |
| `windows[].kbps`       | number [0.001, 1000000]        |
| `windows[].latencyMs`  | number [0, 3600000]            |

## Semantic checks · Verificações semânticas

English: The schema checks shape and scalar bounds. The engine additionally checks relationships such as unique identities, references, geometry consistency, non-overlapping windows or non-degenerate fits, as applicable. Unknown fields are rejected at object boundaries. Numbers must be finite. Validation occurs before analysis and imported inputs are limited to 1 MB in both interfaces.

Português: O esquema verifica estrutura e limites escalares. O mecanismo também verifica relações como identidades únicas, referências, consistência geométrica, janelas sem sobreposição ou ajustes não degenerados, conforme o domínio. Campos desconhecidos são rejeitados nos objetos. Números devem ser finitos. A validação ocorre antes da análise e entradas importadas são limitadas a 1 MB em ambas as interfaces.

## Report · Relatório

`schemaVersion`, `analysisVersion`, `projectId`, `scenarioId`, `source`, `status`, `metrics`, `findings` and `records` form the shared envelope. Project-specific fields retain the detailed calculation. Numeric results are exported as numbers; localization affects only display. Many presentation values are rounded to six decimal places; a rounded zero does not establish exact physical agreement.

`schemaVersion`, `analysisVersion`, `projectId`, `scenarioId`, `source`, `status`, `metrics`, `findings` e `records` formam o envelope comum. Campos específicos preservam o cálculo detalhado. Resultados numéricos são exportados como números; localização afeta apenas a exibição. Muitos valores de apresentação são arredondados a seis casas decimais; zero arredondado não comprova concordância física exata.

| Status                           | Meaning · Significado                                               | CLI exit · Saída |
| -------------------------------- | ------------------------------------------------------------------- | ---------------- |
| `complete`                       | No model findings / Sem achados no modelo                           | 0                |
| `review-notes`                   | Informational or warning findings / Informações ou avisos           | 0                |
| `review-required`                | At least one error-level finding / Ao menos um achado de nível erro | 2                |
| Invalid input / Entrada inválida | No new report / Sem novo relatório                                  | 1                |
