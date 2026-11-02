# Project 7B: Interface Contract Addendum

**Status:** Agreed design, pending final contract version and sign-off

**Component:** Activity Registry & Target Broker

**Interface:** Project 7A to Project 7B

## 1. Responsibility Boundary

Project 7A is responsible for interpreting authenticated LTI launches and resolving Moodle resource identifiers to internal activity identifiers.

Project 7B receives a normalised launch containing the resolved `activityId`.

7B does not interpret Moodle-specific identifiers or maintain Moodle resource-to-activity mappings.

## 2. Activity and Resource Identifiers

- `activityId` identifies the internal learning activity.
- `resource.id` preserves the originating LMS resource identifier.
- 7B uses `activityId` for registry lookup and target dispatch.
- 7B does not use `resource.id` as a fallback for activity resolution.
- Unknown internal activity IDs are rejected with HTTP 404.

## 3. Required Launch Fields

The current provisional interface requires:

- `contractVersion`
- `launchId`
- `activityId`
- `user.id`
- `resource.id`

The currently implemented contract version is `provisional-0`.

The `user.name` field is optional and may contain `null`.

## 4. Result Structure

A normalised result contains:

- `contractVersion`
- `launchId`
- `activityId`
- `userId`
- `status`

The `message` field is optional under the proposed contract.

Supported statuses:

- `completed`: Activity successfully completed.
- `incomplete`: Activity not completed but not terminally failed.
- `failed`: Activity encountered a terminal failure.

The result must preserve its association with the originating launch, activity and user.

## 5. HTTP Error Handling

| Condition | HTTP Status |
|---|---|
| Invalid incoming launch | 400 |
| Unregistered activity | 404 |
| Target communication failure or invalid result | 502 |
| Target timeout | 504 |

An activity result with `status: failed` is an activity-level outcome, not necessarily an HTTP communication error.

## 6. Integration Evidence

Development integration was verified on 2 November 2026 using:

- 7A development server on port 3001
- 7B broker on port 3000
- Digital Tutor test double on port 4001
- Web VHDL Lab test double on port 4002

Both target routes returned successful completion results through 7A's actual HTTP broker client.

Unknown activities and malformed launches were also tested.

See `integration-test-record.md` for execution details.

## 7. Outstanding Items

- Final shared contract version and joint sign-off.
- Formal execution of the SYS-7B system-test baseline.
- Verification against 7A's final activity-ID resolution implementation.
- Final agreement on error-response propagation across the 7A–7B boundary.
