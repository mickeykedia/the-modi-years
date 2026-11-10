# Editorial workflow

## Interfaces

The editor can provide instructions in Codex or email the Hermes address. Email subjects use `[modi-record]`; the body can remain free-form.

Hermes converts email into a private, structured `MR-####` proposal using `agents/hermes-editorial-inbox/`. It may clarify, research, and prepare a patch, but it cannot publish. Codex can read the proposal queue when online and prepare a review bundle.

## Review bundle

Each bundle shows:

- the request and origin;
- the affected action;
- facts, sources, and judgement changes separately;
- before/after values;
- uncertainties and conflicts;
- proposed public audit note.

The editor approves, revises, or rejects each proposal. Approval is an editorial decision, not an automatic merge. Validation must pass before publication.

## Offline behavior

Email intake does not depend on the Codex computer. Hermes may queue work in the private editorial repository while Codex is offline. Local Codex processing resumes when that computer is awake and online. If Hermes is also offline, the email remains in the mailbox until it returns.

## Private and public records

Keep raw emails, sender identities, attachments, unfinished research, and rejected private notes in a private editorial repository. Promote only the approved change, publishable rationale, sources, reviewer decision, and provenance identifiers to the public website repository.

## Publication

Merging an approved change into the public repository runs content validation and a static-site build. GitHub Pages deploys only the generated artifact from the protected default branch.
