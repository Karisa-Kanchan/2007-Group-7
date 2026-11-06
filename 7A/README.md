# ECNG2007 Project 7A: LTI Protocol Adapter

Project 7A (P7A) is the LTI Protocol Adapter component of ECNG2007 Project 7: LTI Learning Tool Integration.

P7A receives an approved LTI 1.3 launch, maps it to a normalized launch context for Project 7B (P7B), and accepts the corresponding normalized result. It is responsible for preserving the association between the original launch, activity, and returned result.

This directory contains a **working local prototype** developed using Node.js 24, Express, ltijs 7, and MongoDB. The prototype supports local testing and a simulated P7A-to-P7B exchange. It does not yet implement the course-approved LTI-facing result return.

The supplied Software Requirements Specification (SRS) and System Test Baseline govern the project requirements. The teams have since agreed on the [Shared Launch/Result Interface Contract v0.0.1](../docs/Project_7_Shared_Launch_Result_Contract_v0.0.1.docx). Its document version is `v0.0.1`, while the implemented on-wire `contractVersion` remains `provisional-0`.

On 5 November 2026 (Trinidad and Tobago local time), 7A and the actual 7B broker passed seven development-endpoint integration scenarios with the Digital Tutor and Web VHDL Lab test doubles. See the [integration test record](../7B/docs/integration-test-record.md). This does not constitute an authenticated Moodle launch, approval of an LMS-facing result path, or completion of official SYS-7A system acceptance.

For further information, see:

- [Repository review and requirement status](docs/REPOSITORY_REVIEW.md)
- [Contract assumptions](docs/CONTRACT_ASSUMPTIONS.md)
- [System-test readiness](docs/TEST_READINESS.md)
- [Contract replacement checklist](docs/WHEN_CONTRACT_ARRIVES.md)

## 1. Project Structure

P7A is maintained inside the main Group 7 GitHub repository.

```text
2007-Group-7/
│
├── 7A/
│   ├── src/                 Application source code
│   ├── tests/               Developer regression tests
│   ├── fixtures/            Local example launch inputs
│   ├── scripts/             Demonstration and setup scripts
│   ├── docs/                P7A technical documentation
│   ├── .gitignore
│   ├── .node-version
│   ├── docker-compose.yml
│   ├── package.json
│   ├── package-lock.json
│   ├── requests.http
│   └── README.md
│
└── ...
```

The main source files include:

- `ltiServer.js`: Starts the ltijs provider and processes validated LTI launches.
- `normalizeLaunch.js`: Maps launch information into the provisional normalized context.
- `adapter.js`: Coordinates the local launch and result-processing flow.
- `brokerClient.js`: Communicates with the built-in P7B stub or an HTTP broker.
- `launchStore.js`: Maintains local launch and result-association evidence.
- `resultService.js`: Processes normalized results and records their delivery status.
- `contract.js`: Provides provisional local contract validation.
- `mockServer.js`: Exposes development and manual-testing endpoints.
- `config.js`: Reads runtime configuration.

P7B's activity registry, target routing, and target-result normalization remain separate responsibilities.

## 2. Prerequisites

The following software is required:

- Node.js 24
- npm
- Docker and Docker Compose for running MongoDB and the real ltijs provider
- VS Code or another suitable code editor

The required Node.js version is also recorded in `.node-version`.

The **stub-mode** local demonstration does not require MongoDB, Moodle, a real P7B service, or the Digital Tutor/Web VHDL Lab applications. The integrated HTTP demonstration does require the 7B broker and target test doubles.

## 3. Setup and Local Demonstration

All commands in this README should be executed from the `7A/` directory unless stated otherwise.

Open the main Group 7 repository in VS Code and open a terminal.

From the repository root, enter:

```sh
cd 7A
```

Install the dependencies:

```sh
npm ci
```

The dependencies are recorded in `package-lock.json`.

A `.env` file is **not required** for the default local stub demonstration. The application can use its development defaults.

If a `.env.example` file is available and local configuration is needed, it may be copied to `.env`. Otherwise, create `.env` only when specific configuration values are required.

Do not commit credentials, private keys, platform registration settings, or the local `.env` file to GitHub.

### 3.1 Automated Developer Tests

Run:

```sh
npm test
```

This executes the developer regression tests for launch normalization, provisional contract validation, result association, local HTTP interactions, and error handling.

At the time of the repository integration, all 16 developer tests passed.

These tests are not official executions of the course System Test Baseline.

### 3.2 Local Demonstration

Run:

```sh
npm run demo
```

This demonstrates the following local sequence:

```text
Local JSON Launch
        |
        v
P7A Launch Processing
        |
        v
Normalized Launch Context
        |
        v
Built-in P7B Stub
        |
        v
Synthetic Normalized Result
        |
        v
P7A Result Processing
        |
        v
Launch/Result Association Evidence
```

The built-in P7B stub immediately returns a synthetic `completed` result for the received launch.

An `ok: true` response indicates that the local flow accepted the corresponding result.

The output:

```json
"ltiDelivery": {
  "status": "blocked"
}
```

indicates that the approved LTI-facing result operation has not been performed.

This is expected at the current stage.

The demonstration does not constitute an authenticated LTI launch or the final integrated P7A/P7B/target demonstration.

## 4. Manual Testing

The project includes a development server that allows requests to be submitted manually.

Start the server:

```sh
npm start
```

The default address is:

```text
http://127.0.0.1:3000
```

The port may be changed through the `PORT` configuration value.

The development server is an unauthenticated testing harness. It is not the actual LTI 1.3 provider.

### 4.1 Testing with VS Code

Open:

```text
requests.http
```

Use the VS Code REST Client extension to execute the included HTTP requests.

Select **Send Request** above the desired request and inspect the response.

The file contains examples for testing the local adapter.

Useful manual checks include:

- Submitting a valid launch.
- Submitting a launch with missing required information.
- Running the complete local demonstration.
- Submitting a normalized result.
- Submitting a result with an unknown launch identifier.
- Submitting a result with an incorrect activity identifier.
- Verifying launch/result association.

The results should follow the provisional validation and correlation behaviour currently implemented by P7A.

### 4.2 Testing with curl

With the development server running, check its health:

```sh
curl http://127.0.0.1:3000/health
```

Run the local demonstration using the example fixture:

```sh
curl -H 'Content-Type: application/json' \
  --data-binary @fixtures/valid-lti-launch.json \
  http://127.0.0.1:3000/dev/demo
```

Use the returned `normalizedLaunch.launchId` to inspect the stored trace:

```text
GET /trace/<launchId>
```

The trace contains evidence of the original launch, accepted results, and blocked LTI delivery status.

The local fixtures in this repository are developer examples. They are not staff-published LTI messages or signed LTI tokens.

### 4.3 Development Watch Mode

For automatic restarting during development, run:

```sh
npm run dev
```

This uses Node.js watch mode.

On the tested Linux environment, Node.js 24 produced a file-watcher error when stopping watch mode with `Ctrl+C`. The server had already started successfully.

If this occurs, use:

```sh
npm start
```

This starts the development server without watch mode and is sufficient for manual testing.

## 5. P7A and P7B Communication

P7A currently supports two local broker modes.

### 5.1 Stub Mode

The default broker mode is:

```text
BROKER_MODE=stub
```

In this mode, P7A communicates with a built-in P7B test stub.

The stub returns a synthetic normalized result without requiring the actual P7B application.

This allows P7A to be developed and tested independently.

### 5.2 HTTP Mode

For provisional HTTP communication, configure:

```text
BROKER_MODE=http
BROKER_URL=<configured broker address>
```

The current development implementation uses `POST /launch` and expects a JSON result in the HTTP response.

These transport conventions are reflected in the team-agreed shared Contract v0.0.1. The latest pre-merge development integration on 5 November 2026 successfully exercised the actual P7B service and two learning-tool test doubles. Authenticated Moodle launch processing and LTI-facing result delivery still require separate verification.

The mock development server also provides:

```text
POST /api/results
```

This allows separately supplied normalized results to be tested in mock mode.

P7A does not perform P7B's internal registry lookup, activity routing, or target-result normalization.

### 5.3 Verified HTTP Integration with Project 7B (Windows CMD)

For the pre-merge integration demonstration, run the Digital Tutor (`npm run start:digital-tutor`), Web VHDL Lab (`npm run start:vhdl-lab`) and 7B broker (`npm start`) in separate CMD terminals from `7B/`. They listen on ports 4001, 4002 and 3000 respectively.

In the `7A/` CMD terminal, start the **development server** (not the authenticated LTI provider):

```cmd
set PORT=3001
set BROKER_MODE=http
set BROKER_URL=http://localhost:3000
npm start
```

In another terminal, submit a development launch:

```cmd
curl.exe -i -X POST http://localhost:3001/dev/demo -H "Content-Type: application/json" -d "{\"sub\":\"student-demo\",\"resourceLink\":{\"id\":\"resource-demo-001\"},\"custom\":{\"activity_id\":\"digital-logic-lesson\"}}"
```

For the Web VHDL Lab, use `custom.activity_id` of `vhdl-simulation` with a different `resourceLink.id`. The development endpoint expects the source-style `sub`, `resourceLink.id` and `custom.activity_id` fields, not merely a top-level `activityId`.

A successful development response includes matching identifiers in `normalizedLaunch` and `normalizedResult`, with `normalizedResult.status: "completed"`. Its `ltiDelivery.status: "blocked"` is expected: **no result was returned to Moodle**. In seven observed development scenarios, both happy-path launches and five negative/failure cases passed. See [7B integration evidence](../7B/docs/integration-test-record.md).

This HTTP integration test does **not** exercise a signed LTI 1.3 launch. For authenticated platform testing, start MongoDB and use `npm run lti` as described below, with an approved HTTPS-reachable endpoint and platform registration.

## 6. MongoDB and the LTI Provider

The actual LTI-facing provider uses ltijs and MongoDB.

MongoDB is used by ltijs for its provider-related storage. The adapter's own launch/result trace evidence is currently stored in memory and does not persist across application restarts.

### 6.1 Starting MongoDB

From the `7A/` directory, run:

```sh
docker compose up -d mongo
```

Verify the connection:

```sh
docker compose exec -T mongo mongosh --quiet \
  --eval 'db.runCommand({ping: 1})'
```

MongoDB is configured to bind to the host loopback address:

```text
127.0.0.1:27017
```

This avoids exposing the database directly on the external network.

#### Existing Container Conflict

If a MongoDB container named `ecng2007-p7a-mongo` already exists from another local copy of the project, Docker may report a container-name conflict.

Inspect it using:

```sh
docker ps -a --filter name=ecng2007-p7a-mongo
```

If the existing container is stopped and suitable for reuse, start it with:

```sh
docker start ecng2007-p7a-mongo
```

Check its status:

```sh
docker ps --filter name=ecng2007-p7a-mongo
```

An existing container managed by another Compose project may not be accessible through `docker compose exec` in the new repository. It can be checked directly using:

```sh
docker exec ecng2007-p7a-mongo mongosh --quiet \
  --eval 'db.runCommand({ping: 1})'
```

Do not delete an existing MongoDB container or its data volume without first checking whether its data is needed.

For a MongoDB container started by the current Compose project, use:

```sh
docker compose stop mongo
```

This stops the service without intentionally removing its data volume.

### 6.2 Starting the LTI Provider

With MongoDB available, run:

```sh
npm run lti
```

This starts the actual ltijs provider using the project's Node.js implementation.

The provider uses:

- `PORT`
- `MONGO_URL`
- ltijs v7 launch-processing callbacks
- Approved platform registration settings when available

The library's default routes include:

```text
/lti/login
/lti/launch
/lti/keys
```

These are ltijs routes and are not invented endpoints for Learning Tool Launch/Result Contract v1.

Do not run the mock server and ltijs provider on the same port simultaneously. Stop one before starting the other, or configure different ports.

Successful provider startup confirms that the local server can initialize. It does not establish that an approved LTI consumer launch has been successfully processed.

LTI protocol and security handling, including the relevant OIDC/JWT verification, is delegated to ltijs rather than manually reimplemented by P7A.

The mock JSON testing routes are not installed in the actual LTI provider.

## 7. LTI Platform Registration

Before testing an approved LTI consumer, the required platform registration settings must be obtained from course staff.

The registration details should be stored locally in an ignored file such as:

```text
platform.local.json
```

Set the following environment variable in a local `.env` file:

```text
LTI_PLATFORM_FILE=platform.local.json
```

The registration file must follow ltijs v7's `PlatformRegistrationInput` format.

The relevant settings include:

- `url`: Platform issuer.
- `clientId`: Platform client identifier.
- `name`: Platform name.
- `authenticationEndpoint`: Platform authentication endpoint.
- `accessTokenEndpoint`: Platform token endpoint.
- `idTokenValidation`: Approved validation method and corresponding key or keyset.
- `authorizationServer`: When required by the platform.

The validation method and associated key/keyset must match the approved platform registration instructions.

No actual platform credentials or registration keys are supplied with this repository.

With MongoDB running and the required configuration available, execute:

```sh
npm run register:platform
npm run lti
```

The registration script creates or updates the corresponding ltijs platform registration record using the supplied settings.

The implementation is intended to preserve existing activation state and keys when updating a matching issuer/client registration.

Platform credentials and generated keys must not be printed or committed.

The provider's login, launch, and keyset URLs should be supplied to the approved consumer according to the staff-provided procedure.

External HTTPS requirements, reverse-proxy settings, and route overrides must be confirmed against the approved test environment.

No particular hosted LTI consumer is assumed.

## 8. Result Processing and LTI Return

After an approved LTI launch has been validated by ltijs, P7A maps the relevant launch information into the provisional normalized course context.

P7A then uses the shared boundary to communicate with P7B or an approved test double.

When a corresponding normalized result is returned, P7A checks the association with the original launch and activity before accepting it.

The current prototype can:

- Accept provisional normalized results.
- Check required result information.
- Reject results that do not correspond to the stored launch or activity.
- Preserve local result-association evidence.
- Report whether an LTI-facing result operation is available.

However, the prototype does not yet perform the approved LTI-facing result return.

The intended result path is:

```text
Approved LTI Consumer
        |
        | LTI Launch
        v
P7A: LTI Protocol Adapter
        |
        | Normalized Launch
        v
P7B: Activity Registry & Target Broker
        |
        | Target Interaction
        v
Approved Target Double
        |
        | Completion / Result
        v
P7B
        |
        | Normalized Result
        v
P7A
        |
        | Approved LTI-Facing Result Path
        v
Approved LTI Consumer
```

The final return operation remains subject to staff confirmation.

In particular, the project still requires clarification of the approved completion/score semantics, result-return mechanism, and the required evidence that the result reached the correct originating launch/activity.

The implementation must not claim that a score or completion has been submitted to an LMS or gradebook until that operation is implemented and verified.

## 9. Testing and Verification

The prototype includes automated developer regression tests.

Run:

```sh
npm test
```

The tests cover:

- Mapping ltijs v7 launch fields.
- Normalization of valid local launch contexts.
- Rejection of missing or malformed identifiers.
- Provisional normalized-result validation.
- Rejection of results associated with another user.
- Preservation of separate launches for the same activity.
- Rejection of unknown launch identifiers.
- Rejection of incorrect activity identifiers.
- Launch/result trace immutability.
- Local P7A-to-P7B-stub-to-P7A processing.
- Local HTTP request/result processing.
- HTTP broker failures and mismatched replies.

The HTTP tests use temporary loopback servers and require permission to listen locally.

Additional manual checks can be performed through:

```text
requests.http
```

The local demonstration is available through:

```sh
npm run demo
```

### 9.1 Difference Between Developer and Official Testing

The tests supplied with this prototype are developer tests.

They are not substitutes for the official Project 7A system tests.

The official tests are:

| Test ID | Test Description |
|---|---|
| SYS-7A-01 | Accept Approved LTI 1.3 Launch |
| SYS-7A-02 | Map Launch to Course-Normalized Context |
| SYS-7A-03 | Verify Contract v1 Conformance |
| SYS-7A-04 | Expose Normalized Launch to Shared Boundary |
| SYS-7A-05 | Accept Approved Normalized Completion/Result |
| SYS-7A-06 | Translate Result Through Approved LTI-Facing Path |
| SYS-7A-07 | Preserve Originating Launch/Activity Association |

The shared contract document is now agreed, but these official system test cases are **not** reported as passed. Approved authenticated LTI test inputs, the LMS-facing result mechanism, and formal acceptance evidence are still outstanding.

P7A must remain independently testable using the approved LTI consumer/reference route and the approved P7B-side test double.

Joint integration testing will additionally require the actual P7B implementation and the approved Digital Tutor/Web VHDL Lab target doubles.

## 10. Remaining Integration Work

The following work must be completed or confirmed before reporting full compliance with the course requirements:

1. Preserve the team-agreed Shared Launch/Result Contract v0.0.1 and obtain any separately required course-staff approval or subsequent contract revision.
2. Verify implementation conformance with the agreed contract and its on-wire `provisional-0` identifier.
3. Confirm any further changes to transport and response conventions with both teams.
4. Obtain the official authenticated launch and result fixtures.
5. Configure and verify the approved LTI test consumer.
6. Confirm the required completion, status, and score semantics.
7. Implement the approved LTI-facing result operation.
8. Verify that each returned result corresponds to its originating launch and activity.
9. Retain and reverify the **completed development** P7A-to-actual-P7B integration on the final merged build.
10. Execute and document the **authenticated** LMS integration and official system tests.
11. Update documentation, requirement traceability, and test evidence using the final approved contract.

The implementation should not introduce unsupported requirements merely to complete these items.

Unapproved error responses, retry policies, timeout behaviour, and contract details must be treated as provisional until clarified.

See [When Contract v1 Arrives](docs/WHEN_CONTRACT_ARRIVES.md) for the planned replacement process.

## 11. Project Scope and Limitations

The scope of P7A is limited to the published course requirements and approved demonstrations.

P7A is not intended to provide:

- A new Moodle installation or Moodle plugin.
- A complete learning management system.
- Full implementation of LTI Advantage.
- Broad gradebook or roster-management services.
- Production-scale hosting or administration.
- The internal activity registry or target-routing functionality assigned to P7B.
- Direct dependence on the actual Digital Tutor or Web VHDL Lab applications for the assessed demonstration.

The project uses established LTI tooling and maintains a logical separation between LTI protocol handling and the shared P7A/P7B contract.

No numerical performance requirements for latency, throughput, concurrency, memory, or payload size have been formally approved.

Measurements may be recorded during testing but must not be presented as approved acceptance thresholds unless confirmed by course staff.

## 12. Technical References

- [ltijs - LTI Tool Provider for Node.js](https://github.com/Cvmcosta/ltijs)
- [1EdTech LTI Implementation Guide](https://standards.1edtech.org/lti/guides/implementation_guide/implementation-guide)

The implementation uses the installed ltijs v7 API. Older examples may use different callback signatures and configuration conventions.

The course SRS, System Test Baseline, published contract, and official staff guidance take precedence over provisional local development assumptions.

## 13. AI Assistance

Codex assisted with repository and documentation review, code corrections, regression tests, and technical documentation.

The team remains responsible for reviewing, understanding, testing, and explaining the submitted implementation.

All project claims and test results must be supported by the actual implementation and corresponding evidence.
