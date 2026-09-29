# Astraloom Level 1–4 submission matrix

| Requirement | Implementation | Evidence/status |
|---|---|---|
| Compact contract and deliberate disclosure | `contracts/astraloom.compact` | Implemented locally |
| Generated managed directory | `contracts/managed/astraloom` | Generated locally; rerun compile after clean clone |
| Passing tests | `src/test` | Run locally/CI; record URL in `docs/RELEASE.md` |
| Wallet connect/disconnect | `frontend/src/contexts/WalletContext.tsx` | Mocked browser test; real wallet evidence pending |
| Frontend circuit call | `/signal` and `frontend/src/lib/astraloom.ts` | Implemented; real Preprod tx pending |
| Public privacy behavior | `/atlas`, `/privacy`, Compact ledger | Implemented; public-chain evidence pending |
| CI/CD | `.github/workflows/ci.yml` | Workflow file present; record passing run URL |
| Product proposal | `PROPOSAL.md` | Draft; approval pending |
| Browser deployment admin | `/admin` | Implemented; owner must deploy and record address |
| Live hosted demo | hosting config | Owner must deploy and smoke-test assets |
| Product X profile | `docs/RELEASE.md` | Not created; owner action |
| Meaningful commit minimums | repository history | Owner action; not fabricated by this workspace |

Do not convert “implemented locally” into “publicly verified” without the corresponding network, hosting, or external evidence.
