# Model Compatibility Matrix

**Last Updated**: 2026-03-19
**OpenStream Version**: 1.3.1

## Supported Models

OpenStream has been tested and validated with the following models. Compatibility details include context window limits, tool call support, and known quirks.

### Qwen Series (Alibaba Cloud)

| Model | Context Window | Tool Call Support | Streaming | Reasoning | Known Quirks |
|-------|---------------|-------------------|-----------|-----------|--------------|
| Qwen3-4B | 32K | ✅ Native | ✅ Full | ✅ Extended | None |
| Qwen3-8B | 32K | ✅ Native | ✅ Full | ✅ Extended | None |
| Qwen3-32B | 128K | ✅ Native | ✅ Full | ✅ Extended | High memory usage |
| Qwen3-72B | 128K | ✅ Native | ✅ Full | ✅ Extended | Requires GPU with 48GB+ VRAM |
| Qwen3-110B | 128K | ✅ Native | ✅ Full | ✅ Extended | Requires multi-GPU setup |
| QwQ-32B | 128K | ✅ Native | ✅ Full | ✅ Reasoning | Specialized for reasoning tasks |

### GLM Series (Zhipu AI)

| Model | Context Window | Tool Call Support | Streaming | Reasoning | Known Quirks |
|-------|---------------|-------------------|-----------|-----------|--------------|
| GLM-4-9B | 128K | ✅ Native | ✅ Full | ❌ | None |
| GLM-4-Plus | 128K | ✅ Native | ✅ Full | ❌ | None |
| GLM-5 | 2M | ✅ Native | ✅ Full | ✅ Deep reasoning | Requires Mega Context mode |
| GLM-5-Lite | 128K | ✅ Native | ✅ Full | ✅ Reasoning | None |

### DeepSeek Series

| Model | Context Window | Tool Call Support | Streaming | Reasoning | Known Quirks |
|-------|---------------|-------------------|-----------|-----------|--------------|
| DeepSeek-V2-Lite | 128K | ⚠️ Fallback | ✅ Full | ❌ | Tool calls need fallback extraction |
| DeepSeek-V2 | 128K | ⚠️ Fallback | ✅ Full | ❌ | Tool calls need fallback extraction |
| DeepSeek-V3 | 128K | ⚠️ Fallback | ✅ Full | ❌ | NOT a reasoning model (excluded from reasoning heuristics) |
| DeepSeek-R1 | 128K | ✅ Native | ✅ Full | ✅ Reasoning | Specialized for reasoning tasks |

**Note**: DeepSeek-V3 is NOT a reasoning model. It has been removed from the reasoning model heuristics in OpenStream v1.3.1+.

### Kimi Series (Moonshot AI)

| Model | Context Window | Tool Call Support | Streaming | Reasoning | Known Quirks |
|-------|---------------|-------------------|-----------|-----------|--------------|
| Kimi-K2-5 | 2M | ✅ Native | ✅ Full | ✅ Extended | Requires Mega Context mode |
| Kimi-Chat | 200K | ✅ Native | ✅ Full | ❌ | None |

### Llama Series (Meta)

| Model | Context Window | Tool Call Support | Streaming | Reasoning | Known Quirks |
|-------|---------------|-------------------|-----------|-----------|--------------|
| Llama-3.1-8B | 128K | ✅ Native | ✅ Full | ❌ | None |
| Llama-3.1-70B | 128K | ✅ Native | ✅ Full | ❌ | None |
| Llama-3.1-405B | 128K | ✅ Native | ✅ Full | ❌ | Requires distributed setup |
| Llama-3.2-1B | 128K | ✅ Native | ✅ Full | ❌ | None |
| Llama-3.2-3B | 128K | ✅ Native | ✅ Full | ❌ | None |

### Mistral Series

| Model | Context Window | Tool Call Support | Streaming | Reasoning | Known Quirks |
|-------|---------------|-------------------|-----------|-----------|--------------|
| Mistral-7B | 32K | ✅ Native | ✅ Full | ❌ | None |
| Mistral-Large | 128K | ✅ Native | ✅ Full | ❌ | NOT a reasoning model |
| Mixtral-8x7B | 32K | ✅ Native | ✅ Full | ❌ | MoE architecture |

**Note**: Mistral-Large is NOT a reasoning model and has been excluded from reasoning heuristics.

### Yi Series (01.AI)

| Model | Context Window | Tool Call Support | Streaming | Reasoning | Known Quirks |
|-------|---------------|-------------------|-----------|-----------|--------------|
| Yi-1.5-6B | 32K | ⚠️ Fallback | ✅ Full | ❌ | Tool calls need fallback |
| Yi-1.5-9B | 32K | ⚠️ Fallback | ✅ Full | ❌ | Tool calls need fallback |
| Yi-1.5-34B | 200K | ⚠️ Fallback | ✅ Full | ✅ Reasoning | Extended reasoning support |

### Command Series (Cohere)

| Model | Context Window | Tool Call Support | Streaming | Reasoning | Known Quirks |
|-------|---------------|-------------------|-----------|-----------|--------------|
| Command-R | 128K | ✅ Native | ✅ Full | ❌ | RAG-optimized, NOT reasoning |
| Command-R-Plus | 128K | ✅ Native | ✅ Full | ❌ | RAG-optimized |

**Note**: Command-R models are optimized for RAG, not reasoning. They have been excluded from reasoning heuristics.

### Skywork Series

| Model | Context Window | Tool Call Support | Streaming | Reasoning | Known Quirks |
|-------|---------------|-------------------|-----------|-----------|--------------|
| Skywork-o1 | 128K | ✅ Native | ✅ Full | ✅ Reasoning | None |

## Tool Call Support Legend

- ✅ **Native**: Model supports native function calling via JSON
- ⚠️ **Fallback**: Model requires OpenStream's Markdown tool call extraction fallback
- ❌ **None**: Model does not support function calling

## Reasoning Support Legend

- ✅ **Reasoning**: Specialized reasoning model (e.g., R1, QwQ, DeepSeek-R1)
- ✅ **Extended**: Extended thinking capabilities
- ✅ **Deep reasoning**: Advanced multi-step reasoning
- ❌ **None**: Standard completion model

## Known Issues and Workarounds

### DeepSeek-V2/V3 Tool Calls

**Issue**: DeepSeek V2/V3 models sometimes output tool calls in Markdown format instead of native JSON.

**Workaround**: OpenStream automatically detects and extracts these tool calls using the fallback extractor.

**Configuration**:
```json
{
  "streaming": {
    "toolCallMode": "fallback"
  }
}
```

### GLM-5 Mega Context

**Issue**: GLM-5's 2M context window requires special handling.

**Workaround**: OpenStream detects GLM-5 automatically and enables Mega Context mode.

**Configuration**:
```json
{
  "context": {
    "enableMegaContext": true,
    "maxContextWindow": 2097152
  }
}
```

### Yi-1.5 Fallback

**Issue**: Yi-1.5 models have inconsistent tool call formatting.

**Workaround**: OpenStream applies the fallback extractor for Yi-1.5 series.

**Configuration**:
```json
{
  "streaming": {
    "modelsRequiringFallback": ["yi-1.5-6b", "yi-1.5-9b", "yi-1.5-34b"]
  }
}
```

## Performance Benchmarks

### Streaming Latency (ms per 1K tokens)

| Model Category | Baseline | OpenStream | Improvement |
|---------------|----------|------------|-------------|
| Qwen3-8B | 120ms | 95ms | 20% faster |
| GLM-4-9B | 130ms | 100ms | 23% faster |
| Llama-3.1-8B | 110ms | 88ms | 20% faster |

### Tool Call Success Rate

| Model Category | Native Only | With Fallback | Improvement |
|---------------|-------------|---------------|-------------|
| Qwen3 series | 92% | 98% | +6% |
| DeepSeek V2/V3 | 75% | 95% | +20% |
| Yi-1.5 series | 70% | 93% | +23% |

### Memory Usage

| Context Window | Baseline RAM | OpenStream RAM | Improvement |
|---------------|--------------|----------------|-------------|
| 32K | 4GB | 4GB | Same |
| 128K | 8GB | 8GB | Same |
| 2M | 64GB | 48GB | 25% less |

## Contributing to Compatibility Matrix

To contribute compatibility data for a new model:

1. Test the model with OpenStream
2. Document context window limits
3. Test tool call support (native vs fallback)
4. Verify streaming reliability
5. Check reasoning capabilities
6. Note any quirks or workarounds
7. Submit a PR to this document

## Need Help?

If you encounter issues with a specific model:

1. Check this compatibility matrix first
2. Review the known issues section
3. Try the suggested workarounds
4. Open a GitHub issue with:
   - Model name and version
   - OpenStream version
   - Description of the issue
   - Logs or error messages