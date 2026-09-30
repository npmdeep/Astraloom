# Astraloom

**Private signals, composed in public.**

Astraloom is an experimental privacy-first dApp for Midnight Network. It lets a visitor prove that a private, self-attested signal clears a public threshold. The Compact contract records only the public policy, a bounded proof marker, and a counter; the raw signal and marker secret are not written to public ledger state.

> Astraloom is deployed on Midnight Preprod network.
>
> - **Preprod Deployment Transaction**: [`315e491146083a443455ccf77a16c2d0e2f9281f1efcdf51d3b64daa0be2b861`](https://explorer.1am.xyz/tx/315e491146083a443455ccf77a16c2d0e2f9281f1efcdf51d3b64daa0be2b861?network=preprod)
> - **Preprod Contract Address**: `315e491146083a443455ccf77a16c2d0e2f9281f1efcdf51d3b64daa0be2b861` *(update if different from tx id)*

## Product idea — Level 3 selection

**Age / Eligibility Gate:** Astraloom demonstrates a privacy-preserving eligibility threshold. An operator publishes a rule and a visitor proves a private value meets it without disclosing that value to the public ledger. This MVP is self-attested: it does not prove identity, age, issuer authenticity, membership, or one-person-one-entry behavior.

## What is implemented

- Compact contract with public ledger policy, private witnesses, deliberate `disclose()`, replay protection, operator authorization, pause/resume, and policy rotation.
- Four proof-producing circuits: `weave_signal`, `retune_loom`, `pause_loom`, `resume_loom`.
- React/Vite interface with a distinctive observatory theme, responsive layout, accessibility focus states, and persistent day/night toggle.
- 1AM/Lace-compatible wallet discovery and connect/disconnect flow on Preview and Preprod.
- Browser deployment studio using `createUnprovenDeployTx` and `submitTxAsync`.
- Public atlas that reads indexed state without private witnesses.
- Encrypted operator recovery backup kept out of localStorage.
- Unit tests, mocked wallet browser tests, Playwright smoke tests, CI workflow, and managed ZK assets.

## Privacy model

| Data | Public ledger | Browser/session | Wallet or proving path may process |
|---|---:|---:|---:|
| Threshold, constellation, deadline, capacity | Yes | No | No |
| Raw signal | No | Yes | Possibly |
| Marker secret | No | Yes | Possibly |
| Derived marker | Yes | Derived privately | Yes as transaction input/result |
| Counter and active flag | Yes | No | No |
| Transaction metadata | Observer-visible | No | Yes |

`disclose()` is an intentional Compact compiler annotation. It is not encryption. “Not written to public ledger state” is not the same as “never leaves the browser.” A remote prover or wallet extension can be part of the trust boundary. The signal is self-attested, so this is a selective-disclosure demonstration rather than a verified credential system.

## Quickstart

Requirements: Node 22 LTS, npm 10+, Compact 0.31.0, Docker Desktop for the optional local environment, and a Midnight-compatible wallet for network actions.

```sh
npm ci
npm run compile
npm run verify:assets
npm test
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Development server:

```sh
npm run dev
```

The contract source is `contracts/astraloom.compact`. Generated bindings are copied to `frontend/src/managed/contract`; browser proving assets are copied to `frontend/public/managed`. Do not hand-edit generated files.

## Browser flow

1. Open `/admin` and select Preview or Preprod.
2. Connect 1AM or Lace.
3. Generate operator and maintenance keys, encrypt the backup, and save it offline.
4. Configure the public threshold, constellation, deadline, curator ID, and capacity.
5. Deploy and approve the wallet flow. The address is saved immediately; submitted and indexed are separate states.
6. Visit `/signal` as a visitor or `/atlas` as a public observer.
7. Use `/operator` for private operator actions.

## Level 1–4 readiness

| Level | Local implementation | Owner evidence still required |
|---|---|---|
| 1 | Contract, compile scripts, managed directory, tests, setup docs | Real Preview/Preprod address, compile/test screenshots, public repo, five meaningful commits |
| 2 | Wallet connect/disconnect, circuit call, privacy UI, explorer links | Funded Lace/1AM session, successful Preprod circuit transaction, hosted demo, video, eight commits |
| 3 | Privacy dApp, tests, CI workflow, selected idea proposal | Approved proposal, passing public CI run URL, test screenshot/video, ten commits |
| 4 | Deployment studio, docs, CI, responsive MVP architecture | Verified Preprod MVP, hosted asset smoke test, product X profile, demo link, fifteen commits |

See `docs/RELEASE.md` for the canonical evidence record. Empty fields are not claims of completion.

## Project map

- `contracts/astraloom.compact` — Compact source.
- `contracts/managed/astraloom` — generated contract, circuit IR, prover/verifier keys.
- `frontend/src/lib/midnight.ts` — wallet session and providers.
- `frontend/src/lib/astraloom.ts` — contract compilation, deployment, calls, and state validation.
- `frontend/src/pages` — product UI routes.
- `src/test` — contract, integration, deployment, and recovery tests.
- `.github/workflows/ci.yml` — compile, test, typecheck, build, and browser checks.

## Evidence and release checklist

Before submitting, record the actual values in `docs/RELEASE.md`: contract address (not only a transaction ID), deployment transaction, successful circuit transaction, hosted URL, successful CI run, demo video, proposal approval, and product profile. Never publish wallet seeds, operator secrets, recovery files, or private witness values.

## License

No license has been selected yet. Add one before public release.
