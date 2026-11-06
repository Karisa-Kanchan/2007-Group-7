# ECNG2007 Project 7: LTI Protocol Adapter and Activity Registry / Target Broker

This repository contains two collaborating components:

- **7A: LTI Protocol Adapter** (`7A/`) validates LTI 1.3 launches, normalises launch context, communicates with the broker and associates returned results with the originating launch.
- **7B: Activity Registry & Target Broker** (`7B/`) resolves registered activities, dispatches launches to learning-tool targets and validates/normalises the returned results.

## Shared interface and scope

The team-agreed [Shared Launch/Result Interface Contract v0.0.1](docs/Project_7_Shared_Launch_Result_Contract_v0.0.1.docx) governs the 7A–7B boundary. The contract **document** version is `v0.0.1`; the current on-wire `contractVersion` remains **`provisional-0`**. By default, 7B exposes `POST http://localhost:3000/launch`.

Registered demonstration activities:

| Activity ID | Target test double | Port |
|---|---|---:|
| `digital-logic-lesson` | Digital Tutor | 4001 |
| `vhdl-simulation` | Web VHDL Lab | 4002 |

## Verified development evidence

The following results were observed on the pre-merge `fix-7b-contract-validation` branch (commit `6450d0c`, based on `d4a9698`):

| Test scope | Result | Evidence |
|---|---|---|
| 7B automated regression | **60/60 passed** | [Regression record](7B/docs/regression-test-record.md) |
| 7A → 7B → target → 7A development integration | **7/7 scenarios passed** | [Integration record](7B/docs/integration-test-record.md) |

The seven integration scenarios covered both registered learning-tool routes, an unknown activity, an invalid launch, an unavailable target, a timeout and a mismatched target `launchId`. These tests used 7A's **development** endpoint (`POST /dev/demo`), real HTTP communication with 7B and target test doubles. They did **not** constitute authenticated Moodle LTI launches or formal course system-test acceptance.

The prior 57/57 regression run on commit `ad4f459` remains historical evidence. Newer 7B validation checks account for the current 60-test run.

## Local 7A–7B development integration (Windows CMD)

From the repository root, open a separate CMD terminal for each long-running service:

```cmd
cd 7B
npm ci
npm run start:digital-tutor
```

In another 7B terminal:

```cmd
cd 7B
npm run start:vhdl-lab
```

In a third 7B terminal:

```cmd
cd 7B
npm start
```

Start 7A in a **fourth** CMD terminal:

```cmd
cd 7A
npm ci
set PORT=3001
set BROKER_MODE=http
set BROKER_URL=http://localhost:3000
npm start
```

Only run `npm ci` when dependencies need installing or synchronising. If your terminal is already inside `7A/` or `7B/`, omit the corresponding `cd` command. CMD `set` values apply only to the terminal in which they were set.

Verify 7B with `curl.exe -i http://localhost:3000/health` and `curl.exe -i http://localhost:3000/activities`. With all four services running, a development launch can be exercised from a fifth terminal:

```cmd
curl.exe -i -X POST http://localhost:3001/dev/demo -H "Content-Type: application/json" -d "{\"sub\":\"student-demo\",\"resourceLink\":{\"id\":\"resource-demo-001\"},\"custom\":{\"activity_id\":\"digital-logic-lesson\"}}"
```

The expected successful response includes a `normalizedLaunch`, a matching `normalizedResult` with `status: "completed"`, and an **`ltiDelivery` status of `blocked`**. A completed internal result is **not** evidence that Moodle received a completion or grade.

## Remaining acceptance work

1. Configure and verify 7A's **authenticated** LTI 1.3 provider with an approved Moodle/test platform, MongoDB, platform registration and a reachable HTTPS address.
2. Exercise authentic LMS launch flows for both registered activities and record launch/result correlation.
3. Agree and implement the course-approved LTI-facing result path; it is currently reported as blocked and no Moodle grade/completion delivery has been verified.
4. Complete the official `SYS-7A`/`SYS-7B` baseline, obtain required sign-off and rerun relevant checks on the final merged revision.

The current branch is a documented **pre-merge review candidate**, not an accepted system release. Do not infer that the shared interface approval alone establishes LMS interoperability.

## Documentation

- [7A setup, architecture and LTI configuration](7A/README.md)
- [Shared contract and documentation index](docs/README.md)
- [7B test records and integration checklist](7B/docs/README.md)

Each team remains responsible for reviewing its component's documentation and implementation. Do not commit private keys, platform secrets or local `.env` files.
