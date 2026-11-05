# Project 7 — Final Integration and 7B Acceptance Evidence Checklist

**Status:** Planned / evidence outstanding. Do not mark a box complete without an execution record.

## Freeze and run the candidate

- [ ] Both teams agree on the exact combined repository `main` SHA and contract document revision (`v0.0.1`; wire `provisional-0`).
- [ ] Record environment and install dependencies (`npm ci` separately in `7A` and `7B`).
- [ ] Run `npm test` in `7B` and record every result at the frozen revision.
- [ ] 7A executes and records its own automated suite at the same `main` revision.
- [ ] Confirm `7A` configuration resolves each intended `activityId` to an existing `7B/config/activities.json` registry entry.

## Actual cross-component HTTP exchange

- [ ] Start Digital Tutor test double on 4001, Web VHDL Lab test double on 4002 and 7B on 3000.
- [ ] Start 7A on 3001 with `BROKER_MODE=http` and `BROKER_URL=http://localhost:3000` (or equivalent reachable addresses). Do not rely on a stub broker for this test.
- [ ] Test valid Digital Tutor and Web VHDL Lab launches through the **current** 7A-to-7B path; capture responses and launch correlation.
- [ ] Test unknown `activityId`, malformed required fields, mismatched result identifiers, upstream target failures, invalid/empty JSON and timeout propagation.
- [ ] Verify a legitimate activity-level `failed` result is distinct from HTTP 502/504 failures.
- [ ] Capture target-side received-request evidence where required by the SYS-7B baseline.
- [ ] Verify exact optional/null behaviour of `user.name`, `message` handling and required identity fields under the shared contract.

## Formal baseline and LTI boundary

- [ ] Re-run or reconcile `SYS-7B-01` through `SYS-7B-09` with approved fixtures and expected outputs; log each actual result and any known limitations.
- [ ] 7A team tests an authenticated Moodle/SaLTIre launch passing through the **latest** 7A and 7B where feasible; separately record whether LMS-facing result/grade return exists. Do not claim a passed grade-back path if only development trace is visible.
- [ ] Complete the contract's Section 13 repository SHA, 7A integration evidence, 7B release evidence, and any required approval record via controlled revision.
- [ ] Update the group SDD and STD with accurate revision/date, traceability and formal vs provisional test status.

## Suggested execution record fields

`Test ID | execution date | tester | combined commit | environment | contract revision | preconditions | request/fixture | expected result | observed result | pass/fail/blocked | artefact or log reference | defect link`

**Historical evidence:** `integration-test-record.md` (2 November), `system-test-record.md` (2 November) and `regression-test-record.md` (57/57, development SHA `ad4f459`). None independently establishes final combined acceptance.
