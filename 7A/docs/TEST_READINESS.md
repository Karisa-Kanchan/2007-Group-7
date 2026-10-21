# Implementation/test readiness and local regression evidence

This file records implementation readiness and local developer-check results only. The official submitted Project 7 System Test Baseline (**System_Test_Baseline v0.0.1.pdf**, internally titled Version 1.0 Draft Baseline, 8 October 2026) remains the authority for SYS-7A-01 through SYS-7A-07. This file neither defines alternative system tests nor replaces or modifies the submitted definitions.

SYS-7A-01 through SYS-7A-07 remain **Planned / Not Executed**. Their exact prerequisites, procedures and expected outcomes remain in the PDF, pp. 5–8. The requirement-by-requirement readiness table is in `REPOSITORY_REVIEW.md`.

Missing prerequisites: approved LTI consumer/registration and published launch, authoritative Contract v1 and expected normalized contexts/results, approved P7B boundary fixture, and the course-approved LTI result path with reference evidence. Local examples are not substitutes for these inputs when claiming system-test success.

PEND-7A-01 (invalid/unsupported launches), PEND-7A-02 (nonconforming results) and PEND-P7-01 (numeric limits) remain unbaselined, as stated on p. 15. Developer tests of defensive local behaviour do not assign approved expected outcomes to them.

## Local developer checks

- `tests/core.test.js`: original local normalization, missing identifiers, acceptance, unknown launch, activity mismatch and stub-flow checks. The stub flow now expects blocked LTI delivery.
- `tests/association.test.js`: installed v7 token layout, serialized optional values, malformed inputs, provisional version/status validation, user mismatch, independent launch/result associations and immutable stored evidence.
- `tests/http.test.js`: actual loopback HTTP requests against the mock app and a temporary P7B double; includes successful exchange, failed/non-JSON broker response and a reply for another launch. This is developer boundary regression evidence, not the later baselined P7A/P7B integration test set.

Run `npm test` and `npm run demo`. HTTP tests require permission to bind temporary loopback ports. MongoDB and provider startup are separate smoke checks; neither authenticates a course launch. Run details for this review are recorded below.

## Recording official execution later

Use the submitted baseline's execution record (pp. 16–17): test ID, date/tester, build/commit, staff fixture version, actual result/evidence, pass/fail/blocked, defect reference and regression result. Do not mark a case passed merely because a similarly named developer test passed.

## Review execution record — 10 October 2026

Build: current uncommitted workspace changes; Node v24.21.0, Express 5.3.0, ltijs 7.0.7. Inputs: local development fixtures only. These results were executed by Codex and need team review.

| Check | Actual result |
| --- | --- |
| Original developer tests before changes | 7 passed when run directly. |
| `npm test` after changes | 16 passed, 0 failed. Sandbox initially blocked loopback listeners (`EPERM`); rerun with permission outside the sandbox passed. |
| `npm run demo` | Exit 0; local stub completion accepted; `ltiDelivery.status` is `blocked`, with no LTI result sent. |
| `PORT=3108 npm start` and `GET /health` | Started successfully; HTTP 200 with `status: ok`, component `7A`, broker mode `stub`. |
| Docker Compose status and MongoDB `ping` | Existing `mongo:8` service running; ping returned `{ ok: 1 }`. Docker access required permission. |
| `PORT=3107 npm run lti` | Connected to MongoDB and listened on configured port 3107. |
| Provider `GET /lti/keys` | HTTP 200 with empty keyset (no platform registration configured). |
| Raw unsigned JSON posted to `/lti/launch` | HTTP 400 from ltijs; local JSON did not bypass real launch validation. This is library smoke evidence, not a baselined invalid-launch expected result. |
| Platform registration without configuration | Expected exit 1 and configuration guidance. Successful registration with staff values was not tested because no approved settings were supplied. |
| `node --check` | All 14 project JavaScript files passed. |
| `git diff --check` | Passed. |

Both temporary servers were stopped after checks. The pre-existing MongoDB container was left running. No approved consumer launch, LTI result delivery, real P7B integration or official SYS-7A procedure was executed.
