# docs/

**New here — human or AI agent? Start with [`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md).**
It covers what reading the code will not tell you: the conventions, the reasons
behind them, and the traps this codebase has already paid for once.

## What lives here

| File | Purpose |
|---|---|
| `PROJECT-CONTEXT.md` | Orientation, conventions, current state, open hazards. Hand-written, authoritative for *why*. |
| `database-schema.md` | The schema contract. Hand-maintained and enforced by `backend/scripts/spec_check.py`. |
| `schema-conventions.md` | Naming, constraints, migration rules |
| `api-docs.md`, `api-contracts/` | Endpoint contracts |
| `data-flow.md`, `architecture.html` | System topology |
| `security-policy.md`, `isms-asset-inventory.md` | Compliance artefacts |
| `HOW-TO-REVIEW-PRS.md`, `PR-REVIEW-CHECKLIST.md`, `RESPONDING-TO-A-REVIEW.md` | Review process |
| `adr/` | Architecture decision records |

## Generated docs are not here, on purpose

The `project-intelligence` skill derives an architecture map, codebase map,
table list and route list straight from the code:

```bash
python3 ~/Desktop/Projects/project-intelligence/scripts/analyze-project.py \
    --project-dir . --output-dir .project-intelligence
```

Its output goes to `.project-intelligence/`, which is gitignored. It is kept out
of `docs/` deliberately: two documents answering the same question — one
generated, one authoritative — drift apart, and whichever a reader opens first
looks definitive. Regenerate it whenever you need the current map; never edit it.
