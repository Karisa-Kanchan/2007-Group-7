# Provisional contract assumptions

No Learning Tool Launch/Result Contract v1 schema or published examples were included in the supplied documents. This file describes existing **local development choices**, not approved requirements. The SRS §4.4 (OC-01, OC-02, OC-04, OC-06) leaves these decisions open.

## Local messages

`src/contract.js` holds the version, validators and P7B stub result builder. `src/normalizeLaunch.js` contains the temporary mapping.

| Message | Local fields and behaviour |
| --- | --- |
| Launch | `contractVersion` is fixed to `provisional-0`; `launchId` is a generated UUID; `activityId` is `custom.activity_id`, then input `activityId`, then resource-link ID. |
| Launch context | `user.id` and `resource.id` are nonempty strings. Optional user name, course ID/label/title, resource title and issuer default to `null`; roles default to `[]`. These optional fields are carried for the demo, not a complete schema validation. |
| Result | Matching version, nonempty `launchId`/`activityId`, and `status` of `completed`, `incomplete` or `failed`. Optional `userId` must be nonempty text and match the saved user; optional `message` must be text. |

The version cannot be relabelled as v1 through configuration. An old `CONTRACT_VERSION` environment variable is ignored. Official field names/types/semantics must replace these choices when supplied; changing a label is not conformance.

`rawLaunchFromLtijsContext` reads the installed ltijs **v7** `idToken.user`, `idToken.platform` and `idToken.launch` layout. It is a library-to-prototype mapper, not an authenticator. Only ltijs's resource-link callback is the real launch entry point. JSON fixture acceptance through `/dev/launch` does not establish FR-7A-01.

## Local transport and responses

- `BROKER_MODE=stub` returns a synthetic completion in process, without real P7B or a target.
- `BROKER_MODE=http` posts JSON to `BROKER_URL/launch` and expects a JSON result synchronously. There is no application retry/timeout policy; none is claimed as approved.
- Mock-only routes: `POST /dev/launch`, `POST /dev/demo`, `POST /api/results`, `GET /trace/:launchId`, `GET /health` and `GET /`. They are unauthenticated and bound to loopback for development.
- Existing local response conventions are 200 for accepted processing, 400 for invalid prototype data, 404 for unknown launch/route, 409 for association mismatch and 502 for broker errors. Error names and codes are defensive choices, not baseline requirements. Express's default malformed-body handling also remains library behaviour.

HTTP reply correlation checks the exact launch sent to the broker, even if a reply references another otherwise valid saved launch. Separately submitted results are looked up by their provisional launch ID and checked against the saved activity and optional user. This is correlation, not authentication.

## Result path and evidence

`processResult` stores each accepted result against the original launch and returns `ltiDelivery.status: "blocked"`. `ok: true` describes local acceptance only. `pendingLtiDelivery` in `src/resultService.js` marks where the eventual approved operation must be implemented. No AGS fields, scores, result endpoint or staff-approved delivery success is fabricated.

The original launch and all locally accepted results are retained in memory with event names. Repeated submissions are recorded; no deduplication, restart persistence, retention or delivery guarantee is claimed. No raw JWT, ltik or private key is stored in this public development trace. Staff's result path may require private library context to be retained separately; confirm this before implementing it.
