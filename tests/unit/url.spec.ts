import { describe, expect, it } from 'vitest';
import { isValidUrl, sanitizeUrl } from '../../src/helpers/url.ts';

describe('url helpers', () => {
  describe('isValidUrl', () => {
    it('accepts valid http and https urls', () => {
      expect(isValidUrl('https://www.youtube.com/watch?v=123')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('rejects invalid urls or other protocols', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
    });
  });

  describe('sanitizeUrl', () => {
    it('strips YouTube Mix playlist params from watch urls', () => {
      const input = 'https://www.youtube.com/watch?v=4q9UafsiQ6k&list=RD4q9UafsiQ6k&start_radio=1&index=1';
      const sanitized = sanitizeUrl(input);
      expect(sanitized).toBe('https://www.youtube.com/watch?v=4q9UafsiQ6k');
    });

    it('strips YouTube Mix playlist params from youtu.be urls', () => {
      const input = 'https://youtu.be/4q9UafsiQ6k?list=RDEM123&start_radio=1';
      const sanitized = sanitizeUrl(input);
      expect(sanitized).toBe('https://youtu.be/4q9UafsiQ6k');
    });

    it('strips YouTube UL mix playlist params', () => {
      const input = 'https://www.youtube.com/watch?v=4q9UafsiQ6k&list=UL4q9UafsiQ6k';
      const sanitized = sanitizeUrl(input);
      expect(sanitized).toBe('https://www.youtube.com/watch?v=4q9UafsiQ6k');
    });

    it('preserves standard YouTube playlists when on playlist page or with PL prefix', () => {
      const playlistUrl = 'https://www.youtube.com/playlist?list=PLrAl5QY30uP_L2y4w1VqZqZ9';
      expect(sanitizeUrl(playlistUrl)).toBe(playlistUrl);
    });

    it('removes tracking parameters like si, feature, and utm params', () => {
      const input = 'https://www.youtube.com/watch?v=4q9UafsiQ6k&si=xyz123&feature=share&utm_source=twitter';
      const sanitized = sanitizeUrl(input);
      expect(sanitized).toBe('https://www.youtube.com/watch?v=4q9UafsiQ6k');
    });

    it('handles empty or malformed strings gracefully', () => {
      expect(sanitizeUrl('')).toBe('');
      expect(sanitizeUrl('invalid-url')).toBe('invalid-url');
    });
  });
});
