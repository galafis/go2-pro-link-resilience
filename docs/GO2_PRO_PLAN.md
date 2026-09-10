# Go2 PRO development plan · Plano de desenvolvimento com o Go2 PRO

## English

A search exercise can collect an observation before it can deliver it. This workbench separates those times and makes undelivered messages visible. It supports planning what to record during a prospective Go2 PRO communication-observation exercise without claiming a radio model or sending device commands.

Use coded, non-personal observation messages in a controlled exercise. Record creation, transmission and reception times with a documented clock relation. Measure missing messages as well as delivered ones. Compare the supplied window model with observations before interpreting queue-policy effects.

## Português

Um exercício de busca pode coletar uma observação antes de conseguir entregá-la. A bancada separa esses instantes e torna visíveis mensagens não entregues. Apoia o planejamento dos registros de um futuro exercício de observação de comunicação com o Go2 PRO, sem afirmar um modelo de rádio ou enviar comandos ao dispositivo.

Use mensagens codificadas sem conteúdo pessoal em um exercício controlado. Registre criação, transmissão e recepção com relação documentada entre relógios. Meça mensagens ausentes e entregues. Compare as janelas do modelo com observações antes de interpretar efeitos da política de fila.

```mermaid
flowchart LR
  A["Synthetic examples / Exemplos sintéticos"] --> B["Reviewed assumptions / Hipóteses revisadas"]
  B --> C["Confirmed interfaces / Interfaces confirmadas"]
  C --> D["Controlled measurements / Medições controladas"]
  D --> E["Independent comparison / Comparação independente"]
  E --> F["Documented findings / Resultados documentados"]
```

| Stage · Etapa                                                     | Current evidence / Evidência atual                                                                     | Completion condition / Condição de conclusão                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Software model / Modelo de software                               | Implemented, with tests and reproducible scenarios / Implementado, com testes e cenários reproduzíveis | Review the domain assumptions / Revisar hipóteses do domínio                                                 |
| Platform configuration / Configuração da plataforma               | Pending exact interface confirmation / Pendente de confirmação exata das interfaces                    | Written configuration and interface compatibility / Compatibilidade documentada de configuração e interfaces |
| Adapter / Adaptador                                               | No vendor/device adapter in this release / Sem adaptador de fabricante/dispositivo nesta versão        | Separate implementation and interface tests / Implementação e testes de interface próprios                   |
| Physical measurements / Medições físicas                          | Not performed by this repository / Não realizadas por este repositório                                 | Controlled protocol and independent measurements / Protocolo controlado e medições independentes             |
| Participant or field study / Estudo com participantes ou em campo | Not established / Não estabelecido                                                                     | Separate study design and applicable review / Desenho de estudo e revisão aplicável próprios                 |

## Configuration evidence · Evidência de configuração

The [official Go2 page](https://www.unitree.com/go2/) distinguishes configurations; its comparison lists secondary development for EDU and marks it unavailable for the standard PRO. The existence of [Unitree SDK2](https://github.com/unitreerobotics/unitree_sdk2) does not establish access for a particular PRO unit. Confirm supported interfaces and commercial configuration directly before device work. Reviewed on 2026-09-10.

A [página oficial do Go2](https://www.unitree.com/go2/) distingue configurações; sua comparação lista desenvolvimento secundário para EDU e o marca indisponível no PRO padrão. A existência do [Unitree SDK2](https://github.com/unitreerobotics/unitree_sdk2) não comprova acesso em uma unidade PRO específica. Confirme interfaces e configuração comercial diretamente antes do trabalho com o dispositivo. Revisado em 10/09/2026.

The prototype's scientific usefulness does not depend on claiming unsupported interfaces: it can structure hypotheses and analyze separately collected observations. / A utilidade científica do protótipo não depende de afirmar interfaces sem suporte: ele estrutura hipóteses e analisa observações coletadas separadamente.
