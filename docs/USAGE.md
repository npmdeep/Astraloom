# Astraloom usage

## Visitor

1. Choose Preview or Preprod in the header.
2. Connect 1AM or Lace.
3. Read the visible constellation terms.
4. Generate or restore a 64-character marker secret; never use a wallet seed phrase.
5. Enter a self-attested signal and submit `weave_signal`.
6. Save the transaction ID and wait for the atlas/indexer to show the marker.

## Public observer

Open `/atlas` to inspect the public threshold, deadline, capacity, active state, counter and marker receipts. The atlas does not receive private signal values.

## Deployment operator

Open `/admin`, connect a wallet, generate keys, encrypt and save the recovery file, configure public policy, and deploy. The contract address is saved before indexer confirmation. Do not deploy again solely because an indexer is delayed.

## Operator

Open `/operator`, connect on the matching network, unlock the encrypted backup, and pause, resume or retune the loom. Each call requires the operator witness and leaves an observable transaction.

## Failure and recovery

- Wallet network mismatch: disconnect, select the intended network, and reconnect.
- Indexer lag: keep the saved address and use “Check confirmation”; do not redeploy.
- Lost operator backup: there is no password reset. Treat the contract as unrecoverable by this app.
- Prover failure: check wallet synchronization, DUST support, asset hosting, and compatible package versions.
