// OpenStream Test Suite: Streaming Edge Cases
// Tests critical streaming scenarios identified in PR #49771

import { describe, it, expect } from 'vitest';
import { parseNdjsonStream } from '../references/patches/ollama-stream';

describe('Streaming Edge Cases', () => {
  describe('Variable Name Correctness', () => {
    it('should use accumulatedBuffer instead of accumBuffer', async () => {
      // Test that the correct variable name is used throughout
      // This prevents the ReferenceError identified in PR #49771
      const mockReader = createMockReader([
        { done: false, value: '{"message":{"content":"test"}}\n' },
        { done: true, value: '' }
      ]);

      const results = [];
      for await (const chunk of parseNdjsonStream(mockReader, 1024)) {
        results.push(chunk);
      }

      expect(results).toHaveLength(1);
      expect(results[0].message.content).toBe('test');
    });
  });

  describe('Content Accumulation During Throttle', () => {
    it('should accumulate content even when throttling', async () => {
      // Test that throttle logic doesn't skip content chunks
      // This prevents content loss identified in PR #49771
      const mockReader = createMockReader([
        { done: false, value: '{"message":{"content":"hello"}}\n' },
        { done: false, value: '{"message":{"content":" world"}}\n' },
        { done: true, value: '' }
      ]);

      const config = { throttleDelay: 1000 }; // 1 second throttle
      let accumulatedContent = '';

      for await (const chunk of parseNdjsonStream(mockReader, 1024, config)) {
        if (chunk.message?.content) {
          accumulatedContent += chunk.message.content;
        }
      }

      // Even with throttling, content should accumulate correctly
      expect(accumulatedContent).toBe('hello world');
    });

    it('should not skip final chunk during throttle', async () => {
      // Test that final chunk with done=true is not skipped
      // This prevents "stream ended without final response" error
      const mockReader = createMockReader([
        { done: false, value: '{"message":{"content":"test"}}\n' },
        { done: true, value: '{"done":true,"message":{"content":""}}' }
      ]);

      const config = { throttleDelay: 1000 };
      let finalResponse = null;

      for await (const chunk of parseNdjsonStream(mockReader, 1024, config)) {
        if (chunk.done) {
          finalResponse = chunk;
        }
      }

      expect(finalResponse).not.toBeNull();
      expect(finalResponse.done).toBe(true);
    });
  });

  describe('Node.js Compatibility', () => {
    it('should not reference navigator.onLine in Node.js environment', () => {
      // Test that no browser-only APIs are used
      // This prevents ReferenceError in Node.js environment
      const ollamaStreamCode = require('fs').readFileSync(
        require.resolve('../references/patches/ollama-stream'),
        'utf-8'
      );

      expect(ollamaStreamCode).not.toContain('navigator.onLine');
      expect(ollamaStreamCode).not.toContain('navigator.');
    });
  });

  describe('Privacy Filtering', () => {
    it('should filter sensitive PII from content', async () => {
      const sensitiveContent = 'My email is test@example.com and phone is 13812345678';
      const mockReader = createMockReader([
        { done: false, value: `{"message":{"content":"${sensitiveContent}"}}\n` },
        { done: true, value: '' }
      ]);

      const results = [];
      for await (const chunk of parseNdjsonStream(mockReader, 1024)) {
        results.push(chunk);
      }

      const filteredContent = results[0].message.content;
      expect(filteredContent).not.toContain('test@example.com');
      expect(filteredContent).not.toContain('13812345678');
    });

    it('should filter credit card numbers', async () => {
      const content = 'Card: 1234-5678-9012-3456';
      const mockReader = createMockReader([
        { done: false, value: `{"message":{"content":"${content}"}}\n` },
        { done: true, value: '' }
      ]);

      const results = [];
      for await (const chunk of parseNdjsonStream(mockReader, 1024)) {
        results.push(chunk);
      }

      expect(results[0].message.content).not.toMatch(/\d{4}-\d{4}-\d{4}-\d{4}/);
    });
  });
});

// Helper function to create mock ReadableStreamDefaultReader
function createMockReader(chunks: Array<{ done: boolean; value: string }>) {
  let index = 0;
  const decoder = new TextEncoder();

  return {
    read: async () => {
      if (index >= chunks.length) {
        return { done: true, value: undefined };
      }
      const chunk = chunks[index++];
      return {
        done: chunk.done,
        value: chunk.value ? decoder.encode(chunk.value) : undefined
      };
    }
  };
}