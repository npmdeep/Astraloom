# Astraloom release manifest

Use this file as the single source of truth for Level 1–4 evidence. Blank fields mean the owner still needs to perform or verify that step.

```text
Application version: 0.1.0
Release commit SHA:
Build timestamp:
Network: preview / preprod
Contract address:
Deployment transaction:
Successful weave_signal transaction:
Hosted URL:
Hosted build identifier:
CI run URL:
Demo video URL:
Proposal approval URL:
Product X profile URL:
```

## Evidence rules

- Record the 64-character contract address separately from deployment transaction ID.
- Mark a transaction as successful only after wallet submission and indexer confirmation.
- Verify hosted `/managed/keys/weave_signal.prover` returns binary content and not SPA HTML.
- Screenshots must show compile output, passing tests, deployment address, or the required UI flow; label each file with its purpose.
- Never store wallet seed phrases, operator secrets, recovery backups, or private witness values in this repository.
