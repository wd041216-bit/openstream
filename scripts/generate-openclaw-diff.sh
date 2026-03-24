#!/bin/bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 /path/to/openclaw"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$1"
OUT_DIR="$ROOT_DIR/artifacts"
OUT_FILE="$OUT_DIR/openclaw-runtime.patch"

mkdir -p "$OUT_DIR"

"$ROOT_DIR/scripts/check-openclaw-target.sh" "$TARGET" >/dev/null

: > "$OUT_FILE"

diff -u "$TARGET/src/agents/ollama-stream.ts" "$ROOT_DIR/references/patches/ollama-stream.ts" >> "$OUT_FILE" || true
diff -u "$TARGET/src/agents/ollama-models.ts" "$ROOT_DIR/references/patches/ollama-models.ts" >> "$OUT_FILE" || true
if [ -f "$TARGET/src/agents/config-utils.ts" ]; then
  diff -u "$TARGET/src/agents/config-utils.ts" "$ROOT_DIR/references/patches/config-utils.ts" >> "$OUT_FILE" || true
else
  diff -u /dev/null "$ROOT_DIR/references/patches/config-utils.ts" >> "$OUT_FILE" || true
fi

echo "Wrote unified diff to $OUT_FILE"
