# Validation evidence · Evidências de validação

The suite currently contains **27 tests**. Five replay committed scenarios; the remaining tests check domain answers, edge cases and interface contracts. / A suíte contém **27 testes**. Cinco reproduzem cenários versionados; os demais verificam respostas do domínio, casos extremos e contratos das interfaces.

```sh
npm test
npm run examples
npm run test:coverage
```

GitHub Checks executes the suite on Linux and Windows with Node.js 22 and 24. Coverage reports measure executed source paths; they do not establish correctness or physical readiness. / O GitHub Checks executa a suíte no Linux e Windows com Node.js 22 e 24. Relatórios de cobertura medem caminhos de código executados; não comprovam correção ou prontidão física.

## Executable checks · Verificações executáveis

### [contracts.test.js](../test/contracts.test.js)

- reproducible example:
- analysis preserves inputs and repeated runs are identical
- report preserves source and version without runtime timestamps
- unsupported versions, unknown fields and invalid provenance are rejected
- non-finite primary values are rejected
- bilingual chart renders data without non-finite coordinates
- primary input default aligns with native numeric stepping
- CLI writes the same report as the domain engine
- CLI rejects invalid input without creating a success report

### [link.test.js](../test/link.test.js)

- decimal 100 kbps serializes 1000 bytes in 80 ms plus 20 ms latency
- arrival exactly at expiration is accepted
- arrival beyond expiration is not delivered
- transmission ending at window boundary is accepted
- transmission cannot cross a window boundary
- propagation delay does not occupy the transmitter
- queued priority is reevaluated after an outage
- later priority does not preempt an active transmission
- large head-of-line message blocks a smaller lower priority message
- no windows reports every message without an infinite loop
- overlapping windows and zero rates are rejected
- delivery accounting conserves message identities and bytes
- unordered windows normalize to the same result
- TTL multiplier changes expiration and preserves message payload size

## Reading the evidence · Como interpretar a evidência

English: Known-answer checks verify independent numerical expectations. Invariant checks exercise multiple generated configurations, including unfavorable outcomes. The command-line test compares its exported report with the same validated domain calculation. Browser-render checks verify that both languages produce charts without non-finite coordinates; they do not replace interactive keyboard and layout review. No hardware, participant or emergency-use validation is claimed.

Português: Testes de resposta conhecida verificam expectativas numéricas independentes. Verificações de invariantes exercitam diversas configurações geradas, incluindo resultados desfavoráveis. O teste da linha de comando compara a exportação com o cálculo de domínio validado. Verificações dos gráficos conferem os dois idiomas e coordenadas finitas; não substituem revisão interativa de teclado e layout. Não se afirma validação em hardware, com participantes ou para emergências.
