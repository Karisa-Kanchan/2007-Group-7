# Project 7B: Integration Test Record

**Course:** ECNG2007 Computer Systems & Software Design

**Project:** 7B, Activity Registry & Target Broker

**Test Date:** 2 November 2026

**Test Environment:** Local Windows 11, Node.js v24.22.0

> **Historical development test, executed 2 November 2026.** Do not read the statuses below as final validation of the 5 November 2026 team-agreed shared interface. See [final-integration-checklist.md](final-integration-checklist.md).

## 1. Objective

To verify that Project 7A can communicate with the actual Project 7B Activity Registry & Target Broker through synchronous HTTP, route launches to the appropriate learning-tool test doubles, and receive correctly associated activity results.

The tests use 7A's development harness rather than a live authenticated Moodle session.

## 2. Test Environment

| Component | Address | Purpose |
|---|---|---|
| 7A Development Server | http://localhost:3001 | Launch normalisation and result processing |
| 7B Activity Broker | http://localhost:3000 | Launch validation, activity resolution and target dispatch |
| Digital Tutor Test Double | http://localhost:4001 | Simulated Digital Tutor |
| Web VHDL Lab Test Double | http://localhost:4002 | Simulated VHDL Lab |

7A was configured using:

- `PORT=3001`
- `BROKER_MODE=http`
- `BROKER_URL=http://localhost:3000`

The shared interface used on-wire `provisional-0`. The rules were subsequently recorded in the team-agreed [Shared Contract v0.0.1](../../docs/Project_7_Shared_Launch_Result_Contract_v0.0.1.docx) on 5 November 2026; this historic test was performed **before** that document baseline and was not rerun by that approval.

## 3. Integration Test Results

### INT-7B-01: Successful Digital Tutor Launch

**Request:** `POST http://localhost:3001/dev/demo`

**Input:**
- User identifier: `student-123`
- Moodle-style resource identifier: `1`
- Custom activity identifier: `digital-logic-lesson`

**Expected:** 7A normalises the launch, 7B dispatches it to the Digital Tutor test double, and a valid completion result returns to 7A.

**Observed:** HTTP `200 OK`. The normalised result contained `activityId: digital-logic-lesson`, `userId: student-123`, and `status: completed`. The result matched the originating launch.

**Outcome:** PASS.

### INT-7B-02: Successful Web VHDL Lab Launch

**Request:** `POST http://localhost:3001/dev/demo`

**Input:**
- User identifier: `student-123`
- Moodle-style resource identifier: `2`
- Custom activity identifier: `vhdl-simulation`

**Expected:** 7B dispatches the launch to the Web VHDL Lab test double and returns a correctly associated result to 7A.

**Observed:** HTTP `200 OK`, with a normalised result containing `activityId: vhdl-simulation`, `userId: student-123`, and `status: completed`.

The originating launch and returned result shared the identifier:

`b8b2e8c6-fb5f-4a79-b31b-9a25a2d21a97`

**Outcome:** PASS.

### INT-7B-03: Unknown Activity

**Request:** `POST http://localhost:3001/dev/demo`

**Input:**
- User identifier: `student-123`
- Resource identifier: `3`
- Activity identifier: `unknown-activity`

**Expected:** 7B rejects the unknown activity and 7A reports the downstream failure.

**Observed:** 7B returned HTTP `404`; 7A returned HTTP `502 Bad Gateway` with:

`Project 7B returned HTTP 404.`

**Outcome:** PASS.

### INT-7B-04: Missing User Identifier

**Request:** `POST http://localhost:3001/dev/demo`

**Input:** A launch containing a resource identifier and activity identifier but no user identifier.

**Expected:** 7A rejects the malformed launch with HTTP `400`.

**Observed:** HTTP `400 Bad Request` with error `INVALID_OR_UNSUPPORTED_LAUNCH` and detail `Launch does not contain a user identifier.`

**Outcome:** PASS.

## 4. Launch Trace Verification

The Web VHDL Lab integration produced the following recorded trace in 7A:

1. `launch-normalized`
2. `launch-accepted`
3. `broker-request-started`
4. `broker-response-received`
5. `result-validated`
6. `lti-result-path-blocked`

The recorded result maintained the originating `launchId`, `activityId` and `userId`.

**Outcome:** PASS for launch/result association and trace verification.

## 5. Additional Observation

During the initial Web VHDL Lab test, the request returned HTTP `502` with `fetch failed`.

Investigation showed that the 7B service was no longer listening on port 3000. After restarting 7B and verifying its `/health` endpoint, the Web VHDL Lab integration succeeded without source-code changes.

This incident demonstrates the importance of confirming service availability before executing integration tests.

## 6. Limitations and Outstanding Work

- **Historical qualification:** At the 2 November execution date the interface agreement had not yet been recorded in Contract v0.0.1. The later team agreement does not retroactively make these results a final contract-acceptance run.
- **Historical qualification:** Resource-to-activity mapping was subsequently documented as a 7A responsibility in the shared contract; the latest mapped 7A implementation must be retested with 7B.
- Tests were performed through 7A's unauthenticated development harness, not a complete live Moodle LTI workflow.
- The `ltiDelivery` status was `blocked`; no result was sent to Moodle.
- The official `SYS-7B-01` through `SYS-7B-09` system-test baseline has not yet been formally executed.
- Target timeout handling has been verified with simulated timeout errors, but an actual deadline-expiration integration test has not yet been performed.

## 7. Conclusion

The integration tests demonstrate that the actual Project 7A development server and Project 7B broker can communicate through the provisional synchronous HTTP interface.

Both registered learning-tool target routes completed successfully, unknown activities were rejected, malformed launches were rejected by 7A, and successful results maintained their originating launch associations.

The development integration is operational. The interface rules were documented in the subsequent team-agreed Contract v0.0.1. **A new execution at the combined release revision**, authenticated LTI integration and formal system-test execution remain outstanding.

## 7A–7B Development Integration Test Execution Record

**Execution date:** 5 November 2026 (Trinidad and Tobago local time; HTTP response timestamps dated 6 November 2026 UTC)

**Test environment:** Windows 11, Node.js, local HTTP services

**Test configuration:** Project 7A configured with `BROKER_MODE=http`, `BROKER_URL=http://localhost:3000` and `PORT=3001`

**Test status:** Completed, 7 of 7 scenarios passed

**Release status:** Pre-merge development integration testing

### 1. Test Environment

The integration tests were conducted using the following components:

| Component | Port | Function |
|---|---|---|
| Project 7A LTI Protocol Adapter development server | 3001 | Accepts development launch requests, normalises launch data and communicates with 7B |
| Project 7B Activity Registry & Target Broker | 3000 | Resolves activities, dispatches launches and validates target results |
| Digital Tutor test double | 4001 | Simulates Digital Tutor activity execution |
| Web VHDL Lab test double | 4002 | Simulates Web VHDL Lab activity execution |

The two registered activities were:

- `digital-logic-lesson`, routed to the Digital Tutor.
- `vhdl-simulation`, routed to the Web VHDL Lab.

Project 7B's `/health` and `/activities` endpoints both returned HTTP 200 before the integration tests began.

The tests used Project 7A's `/dev/demo` endpoint rather than an authenticated Moodle LTI launch. No Moodle-facing result delivery was performed.

### 2. Test Execution Results

| Test ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| INT-AB-01 | Launch Digital Tutor through 7A and 7B | Successful dispatch and completed result with matching identifiers | 7A returned HTTP 200; result status `completed`; correct activity, user and launch identifiers | PASS |
| INT-AB-02 | Launch Web VHDL Lab through 7A and 7B | Successful dispatch and completed result with matching identifiers | 7A returned HTTP 200; result status `completed`; correct activity, user and launch identifiers | PASS |
| INT-AB-03 | Request an unregistered activity | 7B rejects activity with HTTP 404; 7A handles the downstream error | 7A returned HTTP 502 and `BROKER_ERROR`, identifying 7B's HTTP 404 response | PASS |
| INT-AB-04 | Submit a launch with an empty learner identifier | 7A rejects invalid input with HTTP 400 | 7A returned HTTP 400 and `INVALID_OR_UNSUPPORTED_LAUNCH`; missing user identifier reported | PASS |
| INT-AB-05 | Attempt to launch an unavailable Digital Tutor | 7B reports target connection failure without reporting completion | With port 4001 unavailable, 7A returned HTTP 502 and reported 7B's HTTP 502 response; 7B logged `fetch failed` | PASS |
| INT-AB-06 | Launch a reachable target that does not respond before timeout | 7B times out and returns HTTP 504; 7A propagates the failure | 7A returned HTTP 502 and reported 7B's HTTP 504 response; 7B logged an aborted operation due to timeout | PASS |
| INT-AB-07 | Receive a target result with an incorrect launch identifier | 7B rejects the mismatched result instead of accepting completion | 7A returned HTTP 502; 7B logged `Target result launchId does not match originating launch` | PASS |

**Execution summary: 7 passed, 0 failed, 0 blocked within the defined development integration test scope.**

### 3. Positive-Path Evidence

**INT-AB-01: Digital Tutor**

- HTTP response: `200 OK`
- Activity ID: `digital-logic-lesson`
- User ID: `student-demo`
- Launch ID: `0c95b58a-85eb-4252-9011-e332c5274c56`
- Normalised result status: `completed`
- Message: `Digital Tutor activity completed successfully`
- Launch and result identifiers matched.

**INT-AB-02: Web VHDL Lab**

- HTTP response: `200 OK`
- Activity ID: `vhdl-simulation`
- User ID: `student-demo`
- Launch ID: `1f788725-6749-435c-abc9-5d62b15758cb`
- Normalised result status: `completed`
- Message: `Web VHDL Lab activity completed successfully`
- Launch and result identifiers matched.

Both successful results used the on-wire contract version `provisional-0`.

### 4. Negative-Path Evidence

**INT-AB-03:** An unknown activity was rejected by 7B with HTTP 404 and surfaced by 7A as HTTP 502 with `BROKER_ERROR`.

**INT-AB-04:** A launch containing an empty `sub` value was rejected by 7A with HTTP 400 and the detail `Launch does not contain a user identifier.`

**INT-AB-05:** With the Digital Tutor unavailable on port 4001, the request resulted in a downstream HTTP 502. The 7B log recorded `Launch dispatch failed: fetch failed`.

**INT-AB-06:** A temporary target delayed its response beyond 7B's configured timeout. 7B returned HTTP 504, and its log recorded `Launch dispatch failed: The operation was aborted due to timeout`.

**INT-AB-07:** A temporary target returned a deliberately incorrect `launchId`. The 7B log recorded `Launch dispatch failed: Target result launchId does not match originating launch`. The result was not accepted as a successful completion.

### 5. Scope and Limitations

These results demonstrate communication between the 7A development server, 7B broker and both learning-tool test doubles, including controlled error handling.

They do not establish:

- Successful authenticated LTI 1.3 launches originating from Moodle.
- Final Moodle-facing activity-result delivery or grade passback.
- Production deployment readiness or formal system acceptance.

For both successful development launches, 7A reported `ltiDelivery.status: "blocked"` with the reason that the course-approved LTI-facing result path remains outstanding.

### 6. Conclusion

All seven defined 7A–7B development integration scenarios passed. The tested implementation correctly supported activity dispatch, result normalisation, identifier matching, validation and downstream error handling.

The development integration milestone is complete for the tested scope. Authenticated LMS interoperability, final LTI result delivery and any remaining system-level acceptance criteria require separate testing.

**Overall result: PASS, within development integration scope.**