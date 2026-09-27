# Astraloom setup

## Prerequisites

- Node.js 22 LTS
- npm 10+
- Compact compiler 0.31.0
- Docker Desktop if using the local compose environment
- 1AM or Lace for Preview/Preprod browser transactions

## Install and verify

```sh
node --version
npm --version
compact --version
npm ci
npm run compile
npm run verify:assets
npm test
npm run typecheck
npm run build
```

`npm run compile` uses `compactc` when available and falls back to the Compact CLI/WSL paths configured in `scripts/compile-contract.mjs`. Use `compact compile --skip-zk` only for a fast development loop; final submission evidence must include proving assets.

## Environment

Copy `frontend/.env.example` to `frontend/.env.local` when using a configured public address. Addresses are network-scoped. A browser deployment can save its address in localStorage without rebuilding the app.

## Browser development

```sh
npm run dev
```

Open `/admin`, select a network, connect the wallet, and deploy only after saving the encrypted operator backup. `/signal` submits the visitor circuit; `/atlas` reads public state; `/operator` performs authenticated administration.

## Asset smoke test

After a production build and hosting deployment, verify the browser receives binary ZK assets:

```sh
curl -i https://YOUR_HOST/managed/keys/weave_signal.prover
```

The response must be successful, non-HTML, and contain a meaningful binary payload. A SPA fallback response is not a valid proving asset.
