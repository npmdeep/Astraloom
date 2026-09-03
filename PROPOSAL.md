# Astraloom product proposal

## Selected Midnight idea

**Age / Eligibility Gate — privacy-preserving threshold checking.**

## Product

Astraloom is a small, inspectable signal loom. An operator publishes a threshold, expiry and capacity. A visitor supplies a private self-attested signal and proves it clears the threshold. The ledger receives an intentional proof marker and count, not the raw signal or marker secret.

## MVP scope

- Compact contract with threshold, deadline, capacity, active state, marker replay protection, operator commitment, and policy rotation.
- Browser wallet flow for Preview and Preprod.
- Visitor signal chamber, public atlas, operator console, and browser deployment studio.
- Explicit privacy limitations and recovery backup guidance.

## Out of scope

Issuer-backed age credentials, identity verification, Sybil resistance, revocation, anonymous payments, and production legal/compliance claims.

## Acceptance criteria

- A real Compact compile creates managed bindings, circuit IR, and proving/verifying keys.
- At least three deterministic tests pass.
- A wallet can submit `weave_signal` on Preprod after manual funding and approval.
- Public state changes without exposing the raw signal.
- CI compiles, tests, typechecks and builds on every push.

## Approval record

**Status:** Pending owner submission. 

**Approval URL:** —

**Approver:** —

**Date:** —

Do not describe the proposal as approved until external approval evidence is recorded above.
