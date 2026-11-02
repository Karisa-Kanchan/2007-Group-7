# Project 7B: Integration Test Record

**Course:** ECNG2007 Computer Systems & Software Design

**Project:** 7B, Activity Registry & Target Broker

**Test Date:** 2 November 2026

**Test Environment:** Local Windows 11, Node.js v24.22.0

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

The shared Launch/Result Contract remained at `provisional-0`.

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

- The Launch/Result Contract remains provisional until formally agreed by 7A and 7B.
- The policy for mapping Moodle resource identifiers to internal activity identifiers remains under discussion.
- Tests were performed through 7A's unauthenticated development harness, not a complete live Moodle LTI workflow.
- The `ltiDelivery` status was `blocked`; no result was sent to Moodle.
- The official `SYS-7B-01` through `SYS-7B-09` system-test baseline has not yet been formally executed.
- Target timeout handling has been verified with simulated timeout errors, but an actual deadline-expiration integration test has not yet been performed.

## 7. Conclusion

The integration tests demonstrate that the actual Project 7A development server and Project 7B broker can communicate through the provisional synchronous HTTP interface.

Both registered learning-tool target routes completed successfully, unknown activities were rejected, malformed launches were rejected by 7A, and successful results maintained their originating launch associations.

The development integration is operational. Final contract approval, authenticated LTI integration and formal system-test execution remain outstanding.