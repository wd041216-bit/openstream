# Compatibility Matrix

OpenStream should be evaluated against a pinned OpenClaw checkout, not against an unspecified moving target.

## Current Status

| Item | Status | Notes |
| --- | --- | --- |
| OpenClaw upstream repo | Known | `openclaw/openclaw` |
| Default branch | Known | `main` |
| Exact pinned commit for formal evaluation | Pending | Must be recorded before maintainer-facing benchmarking |
| Patched files | Known | `src/agents/ollama-stream.ts`, `src/agents/ollama-models.ts` |
| Added files | Known | `src/agents/config-utils.ts` may be introduced as a new file on baselines where it does not already exist |
| Marketplace-ready package | No | Current shape is core-first |
| Plugin package | No | Future investigation item |

## Minimum Compatibility Contract

Before a core PR is proposed, OpenStream should record:

- the exact OpenClaw commit SHA used for validation
- the exact OpenClaw file paths expected by the installer and diff tooling
- whether additive files like `src/agents/config-utils.ts` already exist on the target baseline
- the Node / pnpm versions used during validation
- the Ollama version used for manual runtime checks

## Suggested Baseline Capture

Run this from a local OpenClaw checkout before benchmarking:

```bash
git rev-parse HEAD
node --version
pnpm --version
ollama --version
```

Record the results in this document or in a future `docs/validation-results.md`.

## Model Families To Validate

The current patch set makes explicit claims or heuristics for:

- Qwen3 / QwQ
- GLM-5
- DeepSeek V3
- Kimi K2.5
- Llama 3.1 family
- Yi 1.5 family

At minimum, one representative from each high-priority family should be tested on the pinned OpenClaw baseline before broad compatibility claims are made.

## Failure Conditions

OpenStream should be treated as incompatible with a given baseline when:

- the expected `src/agents/*` files are missing or moved
- imports no longer resolve after patch application
- build fails on the target OpenClaw revision
- patched streaming or tool-call behavior regresses compared with baseline
