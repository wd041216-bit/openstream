// OpenStream Test Suite: Tool Call Extraction
// Tests tool call extraction patterns identified in PR #49771

import { describe, it, expect } from 'vitest';
import { extractMarkdownToolCalls, makeMarkdownToolCallRe } from '../references/patches/ollama-stream';

describe('Tool Call Extraction', () => {
  describe('Pattern Deduplication', () => {
    it('should not extract the same tool call twice', () => {
      // Test that ADDITIONAL_TOOL_CALL_PATTERNS doesn't duplicate MARKDOWN_TOOL_CALL_RE
      // This prevents double processing identified in PR #49771
      const content = '```json\n{"name":"test_tool","arguments":{"param":"value"}}\n```';
      const allowedNames = new Set(['test_tool']);

      const calls = extractMarkdownToolCalls(content, allowedNames);

      // Should only extract once, not twice
      expect(calls).toHaveLength(1);
      expect(calls[0].function.name).toBe('test_tool');
    });

    it('should extract JSON fenced tool calls', () => {
      const content = '```json\n{"name":"get_weather","arguments":{"city":"Beijing"}}\n```';
      const allowedNames = new Set(['get_weather']);

      const calls = extractMarkdownToolCalls(content, allowedNames);

      expect(calls).toHaveLength(1);
      expect(calls[0].function.name).toBe('get_weather');
      expect(calls[0].function.arguments).toEqual({ city: 'Beijing' });
    });

    it('should extract YAML-like tool calls', () => {
      const content = '```yaml\nname: search_web\narguments:\n  query: "test"\n```';
      const allowedNames = new Set(['search_web']);

      const calls = extractMarkdownToolCalls(content, allowedNames);

      expect(calls).toHaveLength(1);
      expect(calls[0].function.name).toBe('search_web');
    });
  });

  describe('Allowed Tool Names Validation', () => {
    it('should only extract tool calls with allowed names', () => {
      const content = '```json\n{"name":"valid_tool","arguments":{}}\n```\n' +
                      '```json\n{"name":"invalid_tool","arguments":{}}\n```';
      const allowedNames = new Set(['valid_tool']);

      const calls = extractMarkdownToolCalls(content, allowedNames);

      expect(calls).toHaveLength(1);
      expect(calls[0].function.name).toBe('valid_tool');
    });

    it('should ignore random JSON objects with name field', () => {
      const content = '{"name":"Alice","age":30}';
      const allowedNames = new Set(['Alice']);

      // This should NOT be extracted as a tool call
      // because it's not a proper tool call format
      const calls = extractMarkdownToolCalls(content, allowedNames);

      // Should be empty because the JSON doesn't have the right structure
      expect(calls).toHaveLength(0);
    });
  });

  describe('Malformed Tool Calls', () => {
    it('should handle malformed JSON gracefully', () => {
      const content = '```json\n{"name":"test_tool","arguments":{invalid}}\n```';
      const allowedNames = new Set(['test_tool']);

      // Should not throw, should return empty array
      const calls = extractMarkdownToolCalls(content, allowedNames);
      expect(calls).toHaveLength(0);
    });

    it('should handle incomplete tool calls', () => {
      const content = '```json\n{"name":"test_tool"\n```';
      const allowedNames = new Set(['test_tool']);

      const calls = extractMarkdownToolCalls(content, allowedNames);
      expect(calls).toHaveLength(0);
    });

    it('should handle tool calls with missing arguments', () => {
      const content = '```json\n{"name":"test_tool"}\n```';
      const allowedNames = new Set(['test_tool']);

      const calls = extractMarkdownToolCalls(content, allowedNames);
      expect(calls).toHaveLength(1);
      expect(calls[0].function.arguments).toEqual({});
    });
  });

  describe('Multiple Tool Calls', () => {
    it('should extract multiple different tool calls', () => {
      const content = '```json\n{"name":"tool1","arguments":{}}\n```\n' +
                      '```json\n{"name":"tool2","arguments":{}}\n```';
      const allowedNames = new Set(['tool1', 'tool2']);

      const calls = extractMarkdownToolCalls(content, allowedNames);

      expect(calls).toHaveLength(2);
      expect(calls[0].function.name).toBe('tool1');
      expect(calls[1].function.name).toBe('tool2');
    });
  });

  describe('Content Cleanup', () => {
    it('should remove tool call blocks from visible content', () => {
      const content = 'Here is my answer:\n```json\n{"name":"test_tool","arguments":{}}\n```\nThat was the tool call.';
      const allowedNames = new Set(['test_tool']);

      extractMarkdownToolCalls(content, allowedNames);

      // The content cleanup function should remove the JSON block
      // but keep the surrounding text
      const cleanedContent = content
        .replace(makeMarkdownToolCallRe(), '')
        .trim();

      expect(cleanedContent).toBe('Here is my answer:\nThat was the tool call.');
    });
  });
});