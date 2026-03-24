# Benchmark and Replay Fixtures

This directory is reserved for maintainer-facing evidence assets.

## Purpose

OpenStream currently needs reproducible proof for:

- streaming behavior changes
- malformed tool-call fallback behavior
- model heuristic differences

## Current State

- fixture skeletons exist
- no measured benchmark results are committed yet

## Suggested Next Additions

- before/after transcripts for the same model and prompt
- replay cases for malformed markdown tool calls
- a small matrix of OpenClaw revision + model + expected outcome
