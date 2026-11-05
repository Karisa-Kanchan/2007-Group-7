# ECNG2007 Project 7 — LTI Adapter and Activity Registry / Target Broker

This repository contains the Project 7A **LTI Protocol Adapter** (`7A/`) and Project 7B **Activity Registry & Target Broker** (`7B/`).

## Shared interface

The team-agreed specification is [Project 7 Shared Launch/Result Interface Contract v0.0.1](docs/Project_7_Shared_Launch_Result_Contract_v0.0.1.docx). The current on-wire version remains `provisional-0`, and the default 7B endpoint is `POST http://localhost:3000/launch` (configurable). Document approval does **not** mean end-to-end system acceptance.

For configuration and component-specific instructions, see the source folders and [7B documentation](7B/docs/README.md). Historical test evidence and a joint verification checklist are linked there.

## Current evidence limitations

- 7B development regression: 57 tests passed at commit `ad4f459` (historical source revision, not a newly confirmed combined release test).
- Prior 7A development-harness to 7B integration was demonstrated using the two target test doubles.
- Final integration at the selected shared `main` revision, the formal `SYS-7B` baseline, and LMS-facing result/grade delivery require separate verification and evidence.

## Documentation ownership

The shared contract is repository-wide. Each team owns the accuracy of its component documents and unit tests; changes to the 7A implementation or its assumptions should be reviewed by 7A. Neither the LTI-facing grade-delivery path nor the external production learning tools are claimed complete here.
