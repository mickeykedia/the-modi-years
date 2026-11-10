# Agent instructions

## Scope

This repository publishes a static, auditable editorial record. Treat political facts, causal claims, and value judgements as separate fields. All seeded entries remain draft fixtures until claim-level sourcing and human review are complete.

## Change workflow

1. Read `editorial/methodology.md`, the relevant policy file, and `docs/CONTENT-MODEL.md`.
2. For email-originated work, use `agents/hermes-editorial-inbox/SKILL.md` and create a private proposal before editing public records.
3. Do not publish raw emails, sender identities, private attachments, secrets, or unfinished research.
4. Prefer primary sources for the government action and independent evidence for implementation and impact.
5. Preserve attribution, uncertainty, counterevidence, prior scores, and the strongest reasonable countercase.
6. Update `content/actions.json`. When a judgement changes, append to `content/JUDGEMENTS.md`; never rewrite old ledger entries.
7. Add or update a public audit decision when a proposal is approved.
8. Run content validation, build, and tests before proposing publication.

## Prohibitions

- Never invent citations, quotations, dates, outcomes, or source support.
- Never mark a record reviewed without claim-level sources.
- Never merge, deploy, or change an approved score solely because an agent suggested it.
- Never edit generated files in `dist/`; rebuild them from source.
