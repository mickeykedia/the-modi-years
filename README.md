# NDA Record

An evidence-led, auditable map of consequential actions by India's NDA-led Union governments since 2014. The project is currently a design and workflow prototype; all seeded political records and scores are explicitly marked as illustrative until researched and reviewed.

## Project structure

- `content/actions.json` — machine-readable current action records
- `content/themes.json` — user-configurable theme taxonomy
- `content/terms.json` — user-configurable government-term boundaries and labels
- `content/JUDGEMENTS.md` — append-only human-readable judgement ledger
- `editorial/` — selection, scoring, sourcing and theme policies
- `agents/hermes-editorial-inbox/` — portable email-to-proposal skill
- `schemas/` — proposal contracts
- `scripts/validate-content.mjs` — publication guardrails
- `scripts/build-site.mjs` — dependency-free static-site generator
- `docs/EDITORIAL-WORKFLOW.md` — Codex, email, Hermes and review flow
- `docs/HERMES-INTEGRATION.md` — acceptance tests for the actual Hermes machine

## Editing

Edit source records, not generated HTML. Add or update an action in `content/actions.json`, append a corresponding entry to `content/JUDGEMENTS.md` when the assessment changes, then run:

```bash
npm test
```

The build writes the GitHub Pages artifact to `dist/`. Merging to the protected default branch can deploy that directory using `.github/workflows/deploy-pages.yml`.

## Editorial method

The public site shows the record itself; the working method lives in this repository. For each action:

1. Record the decision, date, responsible institution, scope and status.
2. Separate documented facts from claims, and attach primary or authoritative sources at claim level.
3. State the editor's value judgement, values, affected groups, trade-offs, confidence and strongest countercase.
4. Preserve score changes, corrections, review decisions and source changes in the judgement ledger and Git history.

The detailed rules are in `editorial/`: `SELECTION.md`, `SCORING.md`, `SOURCING.md` and `THEMES.md`. A record remains a draft until it passes the validation and review requirements defined there.

## Private editorial workflow

There are two low-friction ways to propose a change:

- Ask Codex to add an action, revise an interpretation, change a score or improve sources.
- Email the Hermes address with `[modi-record]` in the subject and describe the change in ordinary language.

Either route creates a reviewable proposal. It does not publish automatically. The editor approves, modifies or rejects the proposal; approved changes update the structured record and, when relevant, append a judgement-ledger entry. The full flow is documented in `docs/EDITORIAL-WORKFLOW.md`.

## Email intake

Send a free-form email to the Hermes address with `[modi-record]` in the subject. Hermes uses the repository-owned skill to create a private `MR-####` proposal. It must not publish directly. Raw email and private research stay in a separate private editorial repository; only approved, redacted decisions enter this public repository.
