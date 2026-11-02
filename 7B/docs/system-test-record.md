# Project 7B — System Test Execution Record

**Date:** 2 November 2026  
**Component:** Activity Registry & Target Broker (7B)  
**Branch:** `7B`  
**Test basis:** *ECNG2007 Project 7 — System Test Baseline v0.0.1*, SYS-7B-01 through SYS-7B-09  
**Implementation contract:** `provisional-0` (joint 7A–7B design; final sign-off pending)  
**Execution environment:** Windows 11, Node.js/Express, 7B HTTP server on `localhost:3000`; Digital Tutor test double on `localhost:4001`; Web VHDL Lab test double on `localhost:4002`.

## Acceptance qualification

The official baseline refers to an authoritative Learning Tool Launch/Result Contract v1, published launch/result examples and approved fixtures. These were not used in this execution. Consequently, the observations below constitute **provisional system-level evidence**, not final acceptance of the nine official baseline tests. Where behaviour was verified through returned responses rather than target-side request logging, that limitation is recorded.

## Baseline test coverage

| Test ID | Baseline objective | Evidence obtained on provisional interface | Disposition |
|---|---|---|---|
| SYS-7B-01 | Accept published normalised launch | Valid `provisional-0` launch accepted, HTTP 200 | Provisionally demonstrated; official fixture pending |
| SYS-7B-02 | Resolve registered activity | GET `/activities/digital-logic-lesson` returned configured entry; successful corresponding launch | Provisionally demonstrated; approved entry pending |
| SYS-7B-03 | One configurable registry for both target types | GET `/activities` listed Digital Tutor and Web VHDL Lab; both launches succeeded | Provisionally demonstrated |
| SYS-7B-04 | Dispatch to configured target | Results returned for entries configured to ports 4001 and 4002 | Provisionally demonstrated; target-side observation not separately captured |
| SYS-7B-05 | Route a published case to each target double | Digital Tutor and Web VHDL Lab each returned expected success through 7B | Provisionally demonstrated; published fixtures pending |
| SYS-7B-06 | Receive target completion/result | Both launches returned `completed` with target-specific messages | Provisionally demonstrated; approved target payloads pending |
| SYS-7B-07 | Normalise target result to Contract v1 | 7B returned consistent `provisional-0` result schema | Provisional-schema check only; Contract v1 comparison pending |
| SYS-7B-08 | Preserve launch/activity association | Both responses preserved their respective `launchId`, `activityId` and `userId` | Provisionally demonstrated |
| SYS-7B-09 | Return normalised result at 7A boundary | Direct 7B HTTP response verified; earlier 7A `/dev/demo` and trace integration demonstrated | Development-harness evidence; approved 7A fixture and final contract pending |

## Executed scenarios and observed results

| Evidence ID | Request/scenario | Observed outcome | Result |
|---|---|---|---|
| E-01 | POST `/launch`, Digital Tutor, `launchId=SYS-7B-01-test`, `activityId=digital-logic-lesson`, `user.id=student-123` | HTTP 200; `completed`; returned matching identifiers and message `Digital Tutor activity completed successfully` | PASS (provisional) |
| E-02 | POST `/launch`, Web VHDL Lab, `launchId=SYS-7B-05-vhdl`, `activityId=vhdl-simulation` | HTTP 200; `completed`; returned matching identifiers and message `Web VHDL Lab activity completed successfully` | PASS (provisional) |
| E-03 | GET `/activities` | HTTP 200; listed `digital-logic-lesson` → `digital-tutor` → `localhost:4001` and `vhdl-simulation` → `web-vhdl-lab` → `localhost:4002` | PASS |
| E-04 | GET `/activities/digital-logic-lesson` | HTTP 200; returned corresponding configured registry entry | PASS |
| E-05 | GET `/activities/unknown-activity` | HTTP 404; `{"error":"Activity not found"}` | PASS |
| E-06 | POST `/launch` without `user.id` | HTTP 400; `{"error":"Invalid launch","details":["user.id is required."]}` | PASS |
| E-07 | POST `/launch` with `activityId=unknown-activity` | Returned `{"error":"Activity not found"}`; HTTP status line not included in captured user output | PARTIAL: body confirmed; status not recorded |
| E-08 | GET `/health` | Returned `{"status":"ok","service":"P7B Activity Registry & Target Broker"}`; status line not included in captured output | PASS for body; HTTP status not recorded |
| E-09 | Stop Digital Tutor process on port 4001 and POST valid Digital Tutor launch | HTTP 502 Bad Gateway; `{"error":"Target dispatch failed"}` | PASS |
| E-10 | Repoint registered Digital Tutor activity temporarily to non-responding HTTP server on port 4003, then POST valid launch | HTTP 504 Gateway Timeout; response body and precise elapsed duration not captured | PASS for status; 10-second timing unverified |
| E-11 | Restore registry target URL to port 4001; restart 7B; inspect `git status --short` | Registry GET showed `http://localhost:4001`; `git status --short` was empty | PASS: configuration restored and working tree clean |

## Additional integration evidence

Prior 7A development-harness integration used 7A `POST /dev/demo` with HTTP broker mode pointed to 7B. Both Digital Tutor and Web VHDL Lab paths returned successful normalised results; an unknown activity was propagated by 7A as `BROKER_ERROR`; a missing user identifier was rejected by 7A. A 7A trace showed launch normalisation, broker dispatch, result validation and intentionally blocked LTI result delivery. Refer to `7B/docs/integration-test-record.md` for the fuller record. This was **not** a complete authenticated LTI launch-to-grade-delivery test.

## Remaining work before final baseline sign-off

1. Agree and baseline the joint 7A–7B contract and official test fixtures; repeat or reconcile SYS-7B-01 through SYS-7B-09 against those inputs.
2. Capture direct target-side request evidence where required by the detailed SYS-7B-04/05 procedure.
3. For SYS-7B-07, compare the normalised result against the approved expected result, not only the provisional schema.
4. For SYS-7B-09, verify with the approved P7A-side test double or fixture; distinguish this from the unauthenticated 7A development harness.
5. Independently measure the timeout duration (the observed 504 establishes timeout behaviour but not the exact 10-second interval).
6. Re-run the full automated suite (`npm test` in `7B`) and record the output at the release checkpoint; earlier developer testing recorded 46 passing tests.

**Overall disposition:** Provisional functional evidence obtained; **final formal baseline acceptance remains pending**.
