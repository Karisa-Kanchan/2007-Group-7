# Project 7B — Development Regression Test Record

**Evidence ID:** `REG-7B-001`
**Component:** Activity Registry & Target Broker
**Revision tested:** `ad4f459` (7B development revision, **not** a subsequently verified combined `main` revision)
**Platform:** Windows 11
**Node.js:** `v24.22.0`
**npm:** `11.19.1`
**Execution:** `npm test` (runs `node --test tests/*.test.js`)
**Working tree:** `git status --short` showed no changes

## Recorded outcome

| Test suite | Executed | Passed | Failed |
|---|---:|---:|---:|
| `broker.test.js` | 5 | 5 | 0 |
| `http.test.js` | 21 | 21 | 0 |
| `launchValidator.test.js` | 10 | 10 | 0 |
| `registry.test.js` | 12 | 12 | 0 |
| `resultNormalizer.test.js` | 9 | 9 | 0 |
| **Total** | **57** | **57** | **0** |

**Cancelled:** 0; **skipped:** 0; **TODO:** 0; **reported duration:** 667.7105 ms.

The console included diagnostic messages from deliberately induced target failures. They belong to passing negative test scenarios, not failed tests.

## Scope and qualification

The tests exercise registry validation and lookup, launch validation, target dispatch, HTTP request/response paths, result normalisation, identifier preservation, timeout and malformed-response handling. This result verifies only the assertions of the **development revision** tested. It is not proof of final contract/system acceptance, all SRS requirements, production-tool integration, or an authenticated LMS-to-target-to-LMS workflow.

A release test record must separately identify the selected combined `main` commit, dependency versions, environment, complete output, and any deviations. See [`final-integration-checklist.md`](final-integration-checklist.md).
