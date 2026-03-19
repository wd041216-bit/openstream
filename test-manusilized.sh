#!/bin/bash
# Test script for OpenStream functionality

echo "🧪 OpenStream Test Suite"
echo "========================"

# Test 1: Check if required files exist
echo "📋 Test 1: File Structure Check"
if [ -f "references/patches/ollama-stream.ts" ] && [ -f "references/patches/ollama-models.ts" ]; then
  echo "✅ PASS: Core patch files found"
else
  echo "❌ FAIL: Missing core patch files"
  exit 1
fi

if [ -f "install-patch.sh" ]; then
  echo "✅ PASS: Installation script found"
else
  echo "❌ FAIL: Missing installation script"
  exit 1
fi

# Test 2: Check file sizes to ensure they're not empty
echo "📋 Test 2: File Content Validation"
STREAM_FILE_SIZE=$(wc -c < "references/patches/ollama-stream.ts" | tr -d ' ')
MODELS_FILE_SIZE=$(wc -c < "references/patches/ollama-models.ts" | tr -d ' ')

if [ "$STREAM_FILE_SIZE" -gt 10000 ]; then
  echo "✅ PASS: ollama-stream.ts has sufficient content"
else
  echo "❌ FAIL: ollama-stream.ts appears to be too small"
  exit 1
fi

if [ "$MODELS_FILE_SIZE" -gt 5000 ]; then
  echo "✅ PASS: ollama-models.ts has sufficient content"
else
  echo "❌ FAIL: ollama-models.ts appears to be too small"
  exit 1
fi

# Test 3: Check for key features in the code
echo "📋 Test 3: Feature Detection"

# Check for enhanced streaming features
if grep -q "streamInterval" "references/patches/ollama-stream.ts"; then
  echo "✅ PASS: Enhanced streaming parameters found"
else
  echo "❌ FAIL: Enhanced streaming parameters missing"
fi

# Check for mega context support
if grep -q "OLLAMA_MEGA_CONTEXT_WINDOW\|2097152" "references/patches/ollama-models.ts"; then
  echo "✅ PASS: Mega context window support found"
else
  echo "❌ FAIL: Mega context window support missing"
fi

# Check for additional tool call patterns
if grep -q "ADDITIONAL_TOOL_CALL_PATTERNS" "references/patches/ollama-stream.ts"; then
  echo "✅ PASS: Extended tool call patterns found"
else
  echo "❌ FAIL: Extended tool call patterns missing"
fi

# Test 4: Check installation script functionality
echo "📋 Test 4: Installation Script Validation"

if grep -q "ENABLE_MEGA_CONTEXT" "install-patch.sh"; then
  echo "✅ PASS: Mega context option found in installer"
else
  echo "❌ FAIL: Mega context option missing from installer"
fi

if grep -q "STREAMING_MODE" "install-patch.sh"; then
  echo "✅ PASS: Streaming mode options found in installer"
else
  echo "❌ FAIL: Streaming mode options missing from installer"
fi

# Test 5: Documentation completeness
echo "📋 Test 5: Documentation Check"

REQUIRED_DOCS=("README.md" "CHANGELOG.md" "UPGRADE_PLAN.md")
for doc in "${REQUIRED_DOCS[@]}"; do
  if [ -f "$doc" ]; then
    echo "✅ PASS: $doc found"
  else
    echo "❌ FAIL: $doc missing"
  fi
done

echo ""
echo "🏁 Test Summary"
echo "==============="
echo "Core functionality tests completed. Please review any FAIL messages above."
echo "For full integration testing, apply the patches to an OpenClaw installation"
echo "and test with various Ollama models."

exit 0