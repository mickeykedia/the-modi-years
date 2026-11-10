#!/usr/bin/env python3
"""Validate a Hermes editorial proposal using only the Python standard library."""

import json
import pathlib
import re
import sys

REQUEST_TYPES = {
    "new_action", "fact_update", "source_update", "judgement_revision",
    "theme_change", "research_request", "editorial_note",
}
STATUSES = {"needs_clarification", "awaiting_review", "approved", "rejected", "superseded"}
CONFIDENCE = {"low", "medium", "high"}
REQUIRED = {
    "schema_version", "project", "request_id", "origin", "origin_agent",
    "origin_message_id", "received_at", "skill_version", "request_type",
    "target", "status", "request_summary", "sender_assertions",
    "proposed_changes", "sources", "open_questions", "confidence", "review_events",
}


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: validate_proposal.py PROPOSAL.json")
    path = pathlib.Path(sys.argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(str(exc))

    missing = sorted(REQUIRED - data.keys())
    if missing:
        fail(f"missing fields: {', '.join(missing)}")
    if data["schema_version"] != 1 or data["project"] != "modi-record":
        fail("schema_version must be 1 and project must be modi-record")
    if not re.fullmatch(r"MR-\d{4,}", str(data["request_id"])):
        fail("request_id must match MR-####")
    if data["origin"] != "email" or data["origin_agent"] != "hermes":
        fail("origin must be email and origin_agent must be hermes")
    if data["request_type"] not in REQUEST_TYPES:
        fail("invalid request_type")
    if data["status"] not in STATUSES:
        fail("invalid status")
    if data["confidence"] not in CONFIDENCE:
        fail("invalid confidence")
    for field in ("sender_assertions", "proposed_changes", "sources", "open_questions", "review_events"):
        if not isinstance(data[field], list):
            fail(f"{field} must be a list")
    print(f"OK: {data['request_id']} is a valid modi-record proposal")


if __name__ == "__main__":
    main()
