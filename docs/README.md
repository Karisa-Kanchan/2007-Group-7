# Project 7 shared interface documentation

## Approved contract baseline

The [Shared Launch/Result Interface Contract v0.0.1](Project_7_Shared_Launch_Result_Contract_v0.0.1.docx) is the team-agreed document supplied on 5 November 2026. The approved copy is retained unchanged. Its **document** version `v0.0.1` is distinct from the implemented on-wire value `contractVersion: "provisional-0"`.

Contract agreement defines interface expectations. It does not by itself prove authenticated Moodle integration, approved result delivery, or formal system acceptance. The 7B-specific [interface implementation addendum](../7B/docs/interface-contract-addendum.md) describes the implemented boundary; the approved shared contract governs in case of disagreement.

## Current development verification

| Evidence | Confirmed scope | Status |
|---|---|---|
| [7B regression test record](../7B/docs/regression-test-record.md) | 60/60 automated tests on `fix-7b-contract-validation`, commit `6450d0c` | **Passed, pre-merge** |
| [7A–7B integration test record](../7B/docs/integration-test-record.md) | 7/7 development-endpoint integration scenarios with actual 7B and learning-tool test doubles | **Passed, pre-merge** |
| [7B system test record](../7B/docs/system-test-record.md) | Provisional `SYS-7B` observations | **Formal acceptance outstanding** |
| [Final integration checklist](../7B/docs/final-integration-checklist.md) | Remaining joint release verification | **Open** |

The earlier 57/57 regression execution on commit `ad4f459` and earlier 7A development-harness runs are historical records; they are not the latest 7B validation result. The seven newer tests confirm the development HTTP pathway, **not** an authenticated LMS launch.

For setup and component-specific detail, see [7A README](../7A/README.md), [7B documentation](../7B/docs/README.md) and the [repository README](../README.md).

## Outstanding authenticated LTI acceptance

- Bring up 7A's `npm run lti` provider with MongoDB, secure platform registration and an approved externally reachable HTTPS endpoint.
- Configure an approved Moodle/reference platform and exercise real LTI 1.3 launches for both activities.
- Confirm the course-approved LTI-facing result operation. The development flow currently reports `ltiDelivery.status: "blocked"`; no LMS-facing result/grade delivery is claimed.
- Execute the official system-test baseline and record approvals, environment, revisions and evidence for the final merged build.

## Controlled document revision items

1. Section 13 of the preserved approved contract contains `05/11/22026`; correct this in a controlled **new revision**, not by silently changing the approved artefact.
2. Section 13's repository/contract commit and P7A integration revision rows contain future-entry instructions rather than verified entries. Enter audited revision values in the next document revision.
3. The fallback wording for `custom.activity_id` should be confirmed with the 7A owner, particularly absent versus invalid supplied values.
4. Changing the on-wire `provisional-0` identifier requires coordinated contract, code, fixture and test updates.

Any lecturer/TA acceptance remains separate from team technical agreement.
