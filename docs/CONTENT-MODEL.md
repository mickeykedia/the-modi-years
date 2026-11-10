# Content model

`content/actions.json` is the machine-readable current record. `content/themes.json` configures navigation. `content/JUDGEMENTS.md` is the human-readable, append-only judgement ledger. Git history remains the exact textual audit trail.

## Action requirements

- Stable lowercase `slug`
- ISO action date
- One configured theme and any number of tags
- Significance independent from judgement
- Editorial status: `draft`, `reviewed`, or `disputed`
- Factual overview, detail, and impact sections
- Score from `-2` through `+2`
- Judgement label, rationale, countercase, values, confidence, assessor, and date
- Claim-level sources for reviewed records
- Change ID linking to the judgement ledger or public audit decision

## Agent proposal requirements

Agent output is a proposal rather than content. It must include origin, tool/skill version, source state, before/after values, confidence, open questions, review events, and resulting commit when approved.

Generated webpages are never edited directly.
