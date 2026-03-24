# Validation Plan

This document defines what evidence is needed before OpenStream should be presented as an OpenClaw core enhancement.

## Current Evidence

Current repository-level validation includes:

- file-presence checks
- basic marker checks for intended patch features
- installer option checks

Run locally:

```bash
bash ./test-openstream.sh
```

This is useful for repository hygiene, but it is **not sufficient** for maintainer review.

## Required Evidence Layers

### 1. Repository Validation

Purpose:

- confirm patch files, docs, and helper scripts are present

Current status:

- available

### 2. Target Checkout Validation

Purpose:

- confirm a candidate OpenClaw checkout has the expected file layout before patching
- capture the exact upstream revision under test

Current status:

- scaffolded via helper scripts

### 3. Patch Diff Review

Purpose:

- let maintainers inspect the true change surface as unified diffs rather than whole-file replacement

Current status:

- scaffolded via helper scripts

### 4. Replay Fixtures

Purpose:

- define specific malformed tool-call and streaming cases that should pass or fail in a known way

Current status:

- initial fixture skeleton only

### 5. Integration Validation

Purpose:

- build patched OpenClaw on a pinned revision
- compare behavior against baseline using the same prompts and models

Current status:

- not yet implemented

## Minimum Acceptance Bar

Before proposing collection or core inclusion, OpenStream should have:

- a pinned OpenClaw baseline
- generated unified diffs for the three touched runtime files
- at least two replay fixtures covering malformed tool-call output
- at least one before/after integration transcript from the same model and prompt
- measured notes replacing unsupported percentage claims

## Suggested First Integration Cases

1. A model that emits a valid native tool call
2. A model that emits a markdown-embedded JSON tool call
3. A model that emits malformed JSON with recoverable structure
4. A long-context model where heuristic context detection matters
