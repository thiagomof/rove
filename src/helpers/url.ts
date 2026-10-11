import { MaybeRef, unref } from 'vue';

const TRACKING_PARAMS = new Set([
  'si',
  'feature',
  'pp',
  'fbclid',
  'gclid',
  'igshid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
]);

export function isValidUrl(input: MaybeRef<string | null>): boolean {
  const value = unref(input);
  if (!value) return false;

  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol);
  } catch {
    return false;
  }
}

export function sanitizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (!/^https?:$/.test(parsed.protocol)) {
      return trimmed;
    }

    const host = parsed.hostname.toLowerCase();
    const isYouTube
      = host === 'youtube.com'
        || host.endsWith('.youtube.com')
        || host === 'youtu.be';

    if (isYouTube) {
      const list = parsed.searchParams.get('list');
      const hasVideo
        = parsed.searchParams.has('v')
          || host === 'youtu.be'
          || parsed.pathname.startsWith('/shorts/');

      // YouTube Mix playlists (RD..., UL..., etc.) or radio mixes:
      // When a single video is played inside an algorithmic YouTube Mix,
      // strip playlist & radio params to avoid scraping hundreds of unwanted radio tracks.
      if (hasVideo && list && (list.startsWith('RD') || list.startsWith('UL'))) {
        parsed.searchParams.delete('list');
        parsed.searchParams.delete('index');
      }

      parsed.searchParams.delete('start_radio');
    }

    // Remove tracking parameters
    for (const param of Array.from(parsed.searchParams.keys())) {
      if (TRACKING_PARAMS.has(param.toLowerCase())) {
        parsed.searchParams.delete(param);
      }
    }

    return parsed.toString();
  } catch {
    return trimmed;
  }
}
