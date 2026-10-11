export type MediaPreviewInfo
  = | { type: 'iframe'; url: string; provider: 'youtube' | 'vimeo' | 'soundcloud' }
    | { type: 'video'; url: string; provider: 'direct' }
    | { type: 'audio'; url: string; provider: 'direct' };

export function getMediaPreviewInfo(rawUrl: string | undefined | null): MediaPreviewInfo | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    // YouTube: youtube.com, m.youtube.com, music.youtube.com, youtu.be
    if (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtu.be') {
      let videoId: string | null = null;

      if (host === 'youtu.be') {
        videoId = parsed.pathname.slice(1).split('/')[0] || null;
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.replace('/shorts/', '').split('/')[0] || null;
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.replace('/embed/', '').split('/')[0] || null;
      } else if (parsed.pathname.startsWith('/v/')) {
        videoId = parsed.pathname.replace('/v/', '').split('/')[0] || null;
      } else {
        videoId = parsed.searchParams.get('v');
      }

      if (videoId && /^[\w-]{11}$/.test(videoId)) {
        return {
          type: 'iframe',
          url: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
          provider: 'youtube',
        };
      }
    }

    // Vimeo: vimeo.com/123456789
    if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
      const match = parsed.pathname.match(/\/(\d{5,})/);
      if (match && match[1]) {
        return {
          type: 'iframe',
          url: `https://player.vimeo.com/video/${match[1]}?autoplay=1`,
          provider: 'vimeo',
        };
      }
    }

    // SoundCloud: soundcloud.com/...
    if (host === 'soundcloud.com' || host.endsWith('.soundcloud.com')) {
      return {
        type: 'iframe',
        url: `https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmed)}&auto_play=true&show_artwork=true&visual=true`,
        provider: 'soundcloud',
      };
    }

    // Direct video / audio URLs
    const pathLower = parsed.pathname.toLowerCase();
    if (
      pathLower.endsWith('.mp4')
      || pathLower.endsWith('.webm')
      || pathLower.endsWith('.ogv')
      || pathLower.endsWith('.mov')
    ) {
      return {
        type: 'video',
        url: trimmed,
        provider: 'direct',
      };
    }

    if (
      pathLower.endsWith('.mp3')
      || pathLower.endsWith('.m4a')
      || pathLower.endsWith('.wav')
      || pathLower.endsWith('.aac')
      || pathLower.endsWith('.ogg')
      || pathLower.endsWith('.flac')
    ) {
      return {
        type: 'audio',
        url: trimmed,
        provider: 'direct',
      };
    }

    return null;
  } catch {
    return null;
  }
}
