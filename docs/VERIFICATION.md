# Astraloom verification log

This file records reproducible local checks without inventing public-chain evidence.

| Check | Command | Status | Evidence |
|---|---|---|---|
| Compact compilation | `npm run compile` | Run locally/CI | Add transcript or CI URL |
| Managed assets | `npm run verify:assets` | Run locally/CI | Add transcript or CI URL |
| Contract/application tests | `npm test` | Run locally/CI | Add test count and CI URL |
| Typecheck | `npm run typecheck` | Run locally/CI | Add transcript or CI URL |
| Production build | `npm run build` | Run locally/CI | Add artifact/run URL |
| Browser checks | `npm run test:e2e` | Run locally/CI | Add report/run URL |
| Hosted proving asset | `curl -i /managed/keys/weave_signal.prover` | Pending host | Add host URL and response evidence |
| Preview/Preprod deployment | Browser Admin Studio | Pending owner | Add address and transaction to `docs/RELEASE.md` |
| Real private circuit call | `/signal` with wallet | Pending owner | Add successful transaction to `docs/RELEASE.md` |
