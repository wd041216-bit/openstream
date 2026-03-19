// OpenStream Test Suite: Privacy Filter
// Tests comprehensive PII and sensitive data filtering

import { describe, it, expect } from 'vitest';
import { filterSensitiveInformation } from '../references/patches/ollama-stream';

describe('Privacy Filter', () => {
  describe('Email Address Filtering', () => {
    it('should mask personal email addresses', () => {
      const content = 'Contact me at test@example.com for details';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('test@example.com');
      expect(filtered).toMatch(/t\*+@example\.com/);
    });

    it('should handle multiple email addresses', () => {
      const content = 'Emails: alice@test.com and bob@example.org';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('alice@test.com');
      expect(filtered).not.toContain('bob@example.org');
    });

    it('should preserve email domain', () => {
      const content = 'admin@company.com';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).toContain('@company.com');
    });
  });

  describe('Phone Number Filtering', () => {
    it('should mask 11-digit phone numbers', () => {
      const content = 'Call me at 13812345678';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('13812345678');
      expect(filtered).toMatch(/138\*+678/);
    });

    it('should handle multiple phone numbers', () => {
      const content = 'Phones: 13812345678 and 15987654321';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('13812345678');
      expect(filtered).not.toContain('15987654321');
    });
  });

  describe('ID Number Filtering', () => {
    it('should mask 15-18 digit ID numbers', () => {
      const content = 'ID: 123456789012345678';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('123456789012345678');
      expect(filtered).toMatch(/\*+/);
    });
  });

  describe('Credit Card Filtering', () => {
    it('should mask credit card numbers with dashes', () => {
      const content = 'Card: 1234-5678-9012-3456';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('1234-5678-9012-3456');
      expect(filtered).toMatch(/\*+/);
    });

    it('should mask 16-digit card numbers without dashes', () => {
      const content = 'Card: 1234567890123456';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('1234567890123456');
    });

    it('should mask IBAN numbers', () => {
      const content = 'IBAN: GB82WEST12345698765432';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('GB82WEST12345698765432');
    });
  });

  describe('Password and Secret Filtering', () => {
    it('should mask password patterns', () => {
      const content = 'password: mysecretpass123';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('mysecretpass123');
    });

    it('should mask API key patterns', () => {
      const content = 'apikey: sk-1234567890abcdef';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('sk-1234567890abcdef');
    });

    it('should mask token patterns', () => {
      const content = 'token: ghp_1234567890abcdef';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('ghp_1234567890abcdef');
    });

    it('should mask secret patterns', () => {
      const content = 'secret: my_api_secret_key';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('my_api_secret_key');
    });
  });

  describe('IP Address Filtering', () => {
    it('should mask IPv4 addresses', () => {
      const content = 'Server IP: 192.168.1.100';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('192.168.1.100');
      expect(filtered).toMatch(/\*+/);
    });

    it('should handle multiple IP addresses', () => {
      const content = 'Primary: 10.0.0.1, Secondary: 172.16.0.1';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('10.0.0.1');
      expect(filtered).not.toContain('172.16.0.1');
    });
  });

  describe('UUID Filtering', () => {
    it('should mask UUIDs', () => {
      const content = 'UUID: 123e4567-e89b-12d3-a456-426614174000';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('123e4567-e89b-12d3-a456-426614174000');
      expect(filtered).toMatch(/\*+/);
    });
  });

  describe('Mixed Content', () => {
    it('should filter multiple types of sensitive data', () => {
      const content = `
        Contact: test@example.com
        Phone: 13812345678
        Card: 1234-5678-9012-3456
        Password: mysecret
        IP: 192.168.1.1
        UUID: 123e4567-e89b-12d3-a456-426614174000
      `;
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('test@example.com');
      expect(filtered).not.toContain('13812345678');
      expect(filtered).not.toContain('1234-5678-9012-3456');
      expect(filtered).not.toContain('mysecret');
      expect(filtered).not.toContain('192.168.1.1');
      expect(filtered).not.toContain('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should preserve non-sensitive content', () => {
      const content = 'Hello, this is a normal message about weather.';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).toBe(content);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      const filtered = filterSensitiveInformation('');
      expect(filtered).toBe('');
    });

    it('should handle content with no sensitive data', () => {
      const content = 'The quick brown fox jumps over the lazy dog.';
      const filtered = filterSensitiveInformation(content);

      expect(filtered).toBe(content);
    });

    it('should handle very long content', () => {
      const content = 'test@example.com '.repeat(1000);
      const filtered = filterSensitiveInformation(content);

      expect(filtered).not.toContain('test@example.com');
    });
  });
});