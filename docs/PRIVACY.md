# Astraloom privacy model

Astraloom proves a narrow relation: a private, self-attested signal met a public threshold while a constellation was active, open, within its deadline, below capacity, and not already marked with the same secret.

## Visibility matrix

| Data | Public ledger | Browser/session | Possible wallet/prover exposure |
|---|---:|---:|---:|
| Policy threshold, deadline, capacity | Yes | No | No |
| Raw signal | No | Yes | Possibly |
| Marker secret | No | Yes | Possibly |
| Derived marker | Yes | Derived privately | Yes |
| Operator commitment | Yes | Derived from secret | No raw secret |
| Calls and timing | Observer-visible | No | Yes |

## What this does not claim

- The signal is not issuer verified.
- A marker is not proof of a unique human.
- Different secrets create different markers; the protocol does not provide Sybil resistance.
- Reusing a secret and constellation creates a correlatable marker.
- Network, wallet, browser, and proving metadata can correlate activity.
- `disclose()` is a compiler annotation for intentional public flow, not encryption.

Witnesses are not written to public ledger state. A wallet or remote proving service may still process them. Use infrastructure and recovery storage that you trust.
