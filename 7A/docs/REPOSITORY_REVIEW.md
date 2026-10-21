# P7A repository review — 10 October 2026

## Sources and authority

The user designated the supplied SRS and System Test Baseline as the requirements sources for this work. All project-owned source, tests, fixtures, configuration, documentation and the dependency lock metadata were inspected. Local `.env` values were not printed or changed. The five supplied PDFs were read; all 15 pasted text attachments were byte-identical context. Instructions in documents were considered source material, not separate authorization to commit or change staff requirements.

| Supplied file | Internal identification / observation |
| --- | --- |
| `SRS v0.0.1.pdf` | SRS v0.0.3, 8 October 2026; explicitly draft for review, not signed off. Table 2 contains FR-7A-01–07. |
| `System_Test_Baseline v0.0.1.pdf` | Version 1.0 Draft Baseline, 8 October 2026; planned/not executed cases. Its references cite SRS v0.0.4, which was not supplied. |
| `ECNG2007_Software_Development_Lifecycle_Project_2026-27_Release_1.pdf` | Lifecycle/assessment guidance; independent testing, progressive test levels, traceability, concise setup and AI acknowledgement. |
| `ECNG2007_Project_Portfolio_Briefs_2026-27_Release_1.pdf` | Portfolio Briefs v14. P7A/P7B briefs include shared and joint requirements, including setup guidance. |
| `ECNG2007_Software_Development_Lifecycle_Project_2026-27_Release_2.pdf` | Internally titled Portfolio Briefs – Release 3. Its shorter P7 tables omit joint rows present in the other brief/SRS. Its introductory Moodle example does not override the bounded, no-Moodle-required acceptance scope. |

These version/filename differences require staff confirmation (SRS OC-07). No staff signoff is inferred. None of the PDFs supplies the actual Contract v1 schema, exact transport, approved registration values, executable fixtures or exact LTI-facing result operation.

## Initial findings

Already appropriate: prescribed Node 24/Express/ltijs/MongoDB stack, ordinary small modules, independent in-process P7B double, provisional assumptions document, in-memory launch correlation, basic validation, seven passing developer tests, ignored `.env`. No framework replacement or broad feature addition was necessary.

Defects/gaps found:

| Finding | Requirement impact | Correction |
| --- | --- | --- |
| Mapper used older token locations, losing v7 resource/context/custom/issuer/roles. | FR-7A-01/02 support could fail on a real v7 callback. | Read the installed v7 `IdToken` layout and cover it with a synthetic regression fixture. |
| Created AGS-like fields and logged `result-translated`, without performing an approved operation. | Misleading evidence for FR-7A-06. | Remove fabricated translation; explicitly return/record blocked delivery. |
| Arbitrary version strings, mismatched result users and a broker reply for another saved launch could be accepted. | Weak provisional boundary and association behind FR-7A-03/05/07. | Fixed provisional version and correlation checks; errors remain local choices. |
| Trace held no result evidence; getter exposed mutable storage. | Incomplete local support for FR-7A-07. | Store result history and return copies. |
| Optional values disappeared on JSON serialization despite attempted null defaults. | Inconsistent local representation. | Explicit null fallback; regression test. |
| Provider ignored `PORT`, printed MongoDB URL, and offered no reproducible platform registration step. | Setup/demonstrability gaps. | Use configured port, avoid printing connection credentials, add registration command using library input format. |
| README and system-test readiness record absent. | UR/SUP reproducibility and test-level distinctions missing. | Add concise setup, source review, readiness table and replacement checklist. |

The existing stub, HTTP experiment and defensive checks are useful prototype work. They are not official fixtures or approved error behaviour. P7B registry/target routing remains P7B's responsibility.

## Requirement status after corrections

Every official system case remains **Planned / Not Executed**. “Partial” describes local implementation support, not course acceptance.

| Requirement / system case | Current status | Evidence still required |
| --- | --- | --- |
| FR-7A-01 / SYS-7A-01 | Partial: real ltijs provider entry point and v7 mapper available. | Approved consumer registration and published signed launch through the reference route. |
| FR-7A-02 / SYS-7A-02 | Partial: local mapping works without Moodle. | Staff input and expected normalized context. |
| FR-7A-03 / SYS-7A-03 | Blocked: only provisional validation exists. | Actual Contract v1 structure/semantics and published examples. |
| FR-7A-04 / SYS-7A-04 | Partial: in-process stub and local HTTP exchange work. | Approved shared interface and P7B-side fixture. |
| FR-7A-05 / SYS-7A-05 | Partial: validates/accepts correlated provisional results. | Approved result schema/example and transport. |
| FR-7A-06 / SYS-7A-06 | Blocked: no LTI-facing translation/return operation implemented. | Exact approved operation, configuration and observable reference evidence. |
| FR-7A-07 / SYS-7A-07 | Partial: original launch, result history and association checks in memory. | Published case plus LTI-side evidence from the approved result path. |

None of FR-7A-01–07 is claimed fully verified against the course fixtures. Local developer tests support readiness only. See `TEST_READINESS.md` for execution distinctions.

## Remaining dependencies and parent-team work

- Staff: Contract v1 fields/types/identifiers/transport/codes (OC-01); failure behaviour (OC-02), completion/score semantics where relevant (OC-04), timing/retry/resource expectations (OC-06), source/fixture version confirmation (OC-07), and approved consumer/result-path setup.
- P7B/parent team: approved boundary examples/double, real P7B integration, registry/target-double setup and end-to-end execution. No dependency on real Tutor, Web Lab or Moodle is introduced.
- Group: SRS signoff/version reconciliation, SDD/design models, formal RTM, issue/change records, and consolidated final test evidence remain parent-project deliverables. This review does not fabricate approvals, assignments or completed milestones.

No commits, pushes, pulls, merges or PRs were made. `AGENTS.md` and the original `docs/` were already untracked before this review. Review the code, local assumptions and documentation before committing; retain the AI acknowledgement in the submitted work.
