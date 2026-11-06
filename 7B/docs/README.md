# Project 7B documentation

Project 7B is the Activity Registry & Target Broker. It resolves activity IDs, dispatches normalised launches to the registered learning-tool targets and validates/normalises their results. The current team-agreed [Shared Launch/Result Contract v0.0.1](../../docs/Project_7_Shared_Launch_Result_Contract_v0.0.1.docx) has an on-wire `contractVersion` of `provisional-0`.

## Documentation index

- [Interface implementation addendum](interface-contract-addendum.md): implemented 7B boundary and transport conventions.
- [Regression test record](regression-test-record.md): latest confirmed **60/60** automated tests on feature commit `6450d0c`; earlier 57/57 result on `ad4f459` is retained as historical evidence.
- [Development integration test record](integration-test-record.md): latest **7/7** 7A → 7B → target → 7A scenarios and prior development-harness evidence.
- [Provisional system test record](system-test-record.md): `SYS-7B-01`–`SYS-7B-09` observations; final formal acceptance outstanding.
- [Final integration checklist](final-integration-checklist.md): coordinated remaining verification and release evidence.
- [Repository setup and execution guide](../../README.md): service startup and example `curl.exe` test.

## Verified status (pre-merge)

| Scope | Result |
|---|---|
| 7B regression (`npm test`) | **60 passed, 0 failed** |
| Development integration scenarios | **7 passed, 0 failed** |
| Shared contract `user.name` validation | Strings, null and omission accepted; numeric/object values rejected |
| Authenticated Moodle launch | **Not yet verified** |
| LTI-facing result / grade delivery | **Blocked / not implemented in verified flow** |
| Formal course system acceptance | **Outstanding** |

The successful integration tests used 7A's unauthenticated `/dev/demo` development route with the real 7B broker and test doubles, not a genuine Moodle LTI launch. No completed Moodle-facing grade delivery should be inferred from a `completed` normalised result.

The 7B validation and evidence updates are held on `fix-7b-contract-validation` at commit `6450d0c`, pending review and merge. After merging, execute the regression and required system checks again on the final revision.
