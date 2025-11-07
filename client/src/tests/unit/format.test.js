// Unit Tests for Format Utilities

import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  truncateText,
  capitalize,
  formatNumber
} from '../../utils/format';

describe('Format Utilities', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = '2024-01-15T00:00:00.000Z';
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('returns empty string for invalid date', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });
  });

  describe('formatDateTime', () => {
    it('formats date and time correctly', () => {
      const date = '2024-01-15T14:30:00.000Z';
      const formatted = formatDateTime(date);
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
    });

    it('returns empty string for invalid date', () => {
      expect(formatDateTime(null)).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "just now" for very recent dates', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('just now');
    });

    it('returns minutes ago for recent dates', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      expect(formatRelativeTime(date)).toContain('minutes ago');
    });

    it('returns hours ago for dates within hours', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      expect(formatRelativeTime(date)).toContain('hours ago');
    });

    it('returns days ago for dates within days', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      expect(formatRelativeTime(date)).toContain('days ago');
    });

    it('returns empty string for invalid date', () => {
      expect(formatRelativeTime(null)).toBe('');
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than max length', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    });

    it('does not truncate text shorter than max length', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe('Short text');
    });

    it('handles empty or null text', () => {
      expect(truncateText(null, 20)).toBe(null);
      expect(truncateText('', 20)).toBe('');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter of word', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
      expect(capitalize('hELLO')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles null or undefined', () => {
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('handles small numbers', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(0)).toBe('0');
    });

    it('handles null and undefined', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });
  });
});
