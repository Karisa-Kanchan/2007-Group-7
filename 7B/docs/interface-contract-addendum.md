# Project 7B: Interface Contract Implementation Addendum

**Component:** Activity Registry & Target Broker (7B)
**Interface:** 7A → 7B normalised launch; 7B → 7A normalised result
**Controlling shared document:** [`../../docs/Project_7_Shared_Launch_Result_Contract_v0.0.1.docx`](../../docs/Project_7_Shared_Launch_Result_Contract_v0.0.1.docx)
**Team agreement:** 5 November 2026 (as documented in the supplied contract); formal release/system acceptance remains pending.
**7B development evidence revision:** `ad4f459`
**On-wire protocol value:** `provisional-0` (unchanged by approval of document v0.0.1)

This addendum records 7B's implemented responsibilities. It does not replace the shared contract or claim that the latest combined implementation has passed formal testing.

## Responsibilities

- 7A authenticates the LTI launch, resolves the *internal* `activityId` from an allowed custom value or configured resource mapping, and transmits the normalised JSON launch.
- 7B validates that launch, looks up `activityId` in `config/activities.json`, dispatches the original launch to the configured target's `/launch`, validates/normalises the response, and returns it to 7A.
- `resource.id` identifies the LMS resource; it is **not** a 7B registry lookup fallback.
- 7B does not authenticate the originating LTI token or perform Moodle grade passback. Do not expose the local development service without an agreed trust boundary.

## Implemented HTTP contract

- `POST /launch`, JSON, 7B default address `http://localhost:3000` (`PORT` configurable).
- Required launch fields: `contractVersion: "provisional-0"`, non-blank `launchId`, `activityId`, `user.id`, `resource.id`. `user.name` may be omitted or null; extra contextual fields can pass through.
- Registered development entries: `digital-logic-lesson` → `digital-tutor` at `http://localhost:4001`; `vhdl-simulation` → `web-vhdl-lab` at `http://localhost:4002`.
- `200` normalised result fields: `contractVersion`, `launchId`, `activityId`, `userId`, `status` (`completed` / `incomplete` / `failed`), `message` (may be empty). These identifiers come from the originating launch; mismatching target-provided identifiers are rejected. The current interface does not provide a numeric score.
- Errors at the 7B boundary: `400` invalid launch; `404` unregistered activity; `502` target failure/invalid target result; `504` target timeout (10-second outbound target deadline). A valid `status: "failed"` is still an activity result, not necessarily a transport error.
- Inspection endpoints: `GET /health`, `GET /activities`, `GET /activities/:activityId`.
- The shared contract does **not** standardise a machine-readable JSON error-body schema. Do not add one as an accepted requirement without a joint change.

## Evidence and open acceptance work

- [`regression-test-record.md`](regression-test-record.md): 57 automated tests passed at commit `ad4f459` on Node.js v24.22.0, npm 11.19.1; no skipped or failed tests; clean working tree.
- [`integration-test-record.md`](integration-test-record.md): successful 2 November development harness scenarios, not a current combined release acceptance run.
- [`system-test-record.md`](system-test-record.md): provisional `SYS-7B-01`–`SYS-7B-09` observations.
- [`final-integration-checklist.md`](final-integration-checklist.md): outstanding joint tests and evidence to capture with the selected `main` commit.

Approved interface rules have replaced the earlier *pending design agreement* wording. **Formal system-test acceptance remains pending**; do not convert provisional outcomes to formal passes without new execution evidence.
