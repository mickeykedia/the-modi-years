# Proposal contract

Create UTF-8 JSON with these required fields:

```json
{
  "schema_version": 1,
  "project": "modi-record",
  "request_id": "MR-0042",
  "origin": "email",
  "origin_agent": "hermes",
  "origin_message_id": "provider-stable-message-id",
  "received_at": "2026-11-09T18:30:00Z",
  "skill_version": "1.0.0",
  "request_type": "judgement_revision",
  "target": "demonetisation-2016",
  "status": "awaiting_review",
  "request_summary": "Reconsider the score using a supplied report.",
  "sender_assertions": [],
  "proposed_changes": [],
  "sources": [],
  "open_questions": [],
  "confidence": "medium",
  "review_events": []
}
```

## Field rules

- Use the stable provider message ID; never place an email address in the public proposal.
- Use `target: null` only for `new_action`, `research_request`, or `editorial_note` when no existing action applies.
- Use JSON Pointer paths in `proposed_changes`, with `before`, `after`, and `reason` values.
- Record source URLs exactly as supplied. Use `verification_status: unverified` until checked.
- Keep `sender_assertions` as attributed claims, not facts.
- Set `status` to `needs_clarification`, `awaiting_review`, `approved`, `rejected`, or `superseded`.
- Append review events with timestamp, actor, decision, reason, and resulting commit when available.

Validate with `scripts/validate_proposal.py` before handoff.
