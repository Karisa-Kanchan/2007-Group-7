# Project 7 shared interface documentation

## Contract baseline

- [Shared Launch/Result Interface Contract v0.0.1](Project_7_Shared_Launch_Result_Contract_v0.0.1.docx) is the **team-agreed interface document** supplied on 5 November 2026. The original file is preserved unchanged here; it documents the wire value `contractVersion: "provisional-0"`.
- Approval of interface rules is **not** evidence of final 7A–7B integration, LMS grade return, or formal SYS-7B acceptance. These are separate verification steps.
- `7B/docs/interface-contract-addendum.md` describes the 7B implementation and its boundary with 7A; the shared contract controls if wording differs.

## Release and evidence records

- `7B/docs/integration-test-record.md`: 2 November **historical development-harness** integration; not a final authenticated Moodle/7A–7B run.
- `7B/docs/system-test-record.md`: provisional system test observations, with missing formal acceptance evidence noted.
- `7B/docs/regression-test-record.md`: confirmed 57/57 development regression against 7B commit `ad4f459`.
- `7B/docs/final-integration-checklist.md`: coordinated release verification and evidence capture checklist.

## Editorial items to resolve in the document's next revision

1. In Section 13, the agreement date reads `05/11/22026`; this is evidently a typo for `05/11/2026` and should be corrected in a **controlled new document revision** (not by silently modifying the approved copy).
2. Section 13's repository/contract commit and P7A integration revision rows contain **instructions for future entries**, not actual commit/evidence values. Replace them with verified values during a documented revision.
3. Section 5's custom activity ID fallback wording should be confirmed by the 7A owner against the exact implementation, especially the difference between an absent and an invalid present value.
4. The file version `v0.0.1` is distinct from the on-wire protocol identifier `provisional-0`; changing the latter requires coordinated code and test changes.

Any required lecturer/TA approval remains separate from team-level technical agreement.
