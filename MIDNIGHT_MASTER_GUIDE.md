# Astraloom — Midnight implementation guide

This guide is the project-specific reference for the Astraloom Midnight integration. It is intentionally separate from generic snippets: generated declarations and the installed package versions are the source of truth.

## Version boundary

- Compact compiler: 0.31.0
- Compact runtime: 0.16.0
- Midnight.js: 4.1.1
- Compact.js: 2.5.1
- ledger-v8: 8.1.0
- Node: 22 LTS in CI
- React 19 and Vite 6

Keep compiler, runtime, ledger and proof assets synchronized. Use `npm ci` and recompile after upgrades.

## Build order

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

Compilation produces `contracts/managed/astraloom`. Browser bindings go to `frontend/src/managed/contract`; circuit IR and keys are served at `frontend/public/managed`. A request for a proving key returning SPA HTML is an asset hosting failure.

## Contract design

`contracts/astraloom.compact` exports public policy and receipt state, three private witnesses, and four state-changing circuits:

- `weave_signal`: checks private signal threshold, active state, deadline, capacity and marker uniqueness.
- `retune_loom`: authenticates the operator witness and changes public policy without erasing history.
- `pause_loom`: operator-only pause.
- `resume_loom`: operator-only resume while capacity and deadline remain valid.

The `edition`, marker and operator hash domains are Astraloom-specific. `disclose()` is used wherever policy, derived receipts or state transitions are intentionally public.

## Constructor order

Read `contracts/managed/astraloom/contract/index.d.ts` after compiling. The constructor arguments are:

1. `threshold`: `bigint` / `Uint<64>`, application range 0–100.
2. `constellation`: 32-byte `Uint8Array` identifier.
3. `deadline`: `bigint` Unix seconds.
4. `curator`: 32-byte public identifier.
5. `operator_hash`: derived public commitment, never the operator secret.
6. `capacity`: `bigint` / `Uint<32>`.

The deployment page derives `operator_hash` with the generated pure circuit.

## Browser provider flow

`frontend/src/lib/midnight.ts` obtains configuration, addresses and proving support from an injected wallet, calls `setNetworkId`, fetches `/managed` ZK assets, constructs proof/wallet/midnight providers, and patches latest-state GraphQL queries to omit unsupported null offsets. The wallet balances and submits transactions; the application distinguishes submitted, indexed and confirmed states.

The frontend never asks for a wallet seed phrase. Session witnesses are held in memory and operator backups are encrypted before download.

## Privacy wording

Use “not written to public ledger state,” not “never leaves the browser.” Use “self-attested threshold proof,” not “verified membership.” A marker blocks reuse of the same secret/constellation combination; it does not prove one person, one vote. Do not promise total anonymity or universal unlinkability.
