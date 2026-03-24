#!/bin/bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 /path/to/openclaw"
  exit 1
fi

TARGET="$1"

REQUIRED_FILES=(
  "src/agents/ollama-stream.ts"
  "src/agents/ollama-models.ts"
)

if [ ! -d "$TARGET" ]; then
  echo "FAIL: target path does not exist: $TARGET"
  exit 1
fi

echo "OpenClaw Target Check"
echo "====================="
echo "Path: $TARGET"

if [ -d "$TARGET/.git" ]; then
  echo "Git commit: $(git -C "$TARGET" rev-parse HEAD)"
else
  echo "Git commit: unavailable (not a git checkout)"
fi

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$TARGET/$file" ]; then
    echo "PASS: $file"
  else
    echo "FAIL: missing $file"
    exit 1
  fi
done

if [ -f "$TARGET/src/agents/config-utils.ts" ]; then
  echo "PASS: src/agents/config-utils.ts"
else
  echo "INFO: src/agents/config-utils.ts is missing on target baseline and would be added by OpenStream"
fi

echo "Target file layout looks compatible with the current OpenStream patch set."
