import { DownloadOptions, TrackType } from './media.ts';

export interface PathPreferences {
  audioDownloadDir: string | null;
  videoDownloadDir: string | null;
  videoDirectoryTemplate: string | null;
  audioDirectoryTemplate: string | null;
}

export const defaultPathPreferences: PathPreferences = {
  audioDownloadDir: null,
  videoDownloadDir: null,
  videoDirectoryTemplate: null,
  audioDirectoryTemplate: null,
};

export interface RecentPreferences {
  recent: Record<string, string[]>;
}

export const defaultRecentPreferences: RecentPreferences = {
  recent: {},
};

export interface FormatPreferences {
  trackType: TrackType;
  videoQuality?: string;
  audioQuality?: string;
}

export const defaultFormatPreferences: FormatPreferences = {
  trackType: TrackType.both,
  videoQuality: 'best',
  audioQuality: 'best',
};

export function formatPreferencesToDownloadOptions(prefs?: FormatPreferences | null): DownloadOptions {
  const trackType = prefs?.trackType ?? TrackType.both;
  const videoQuality = prefs?.videoQuality ?? 'best';
  const audioQuality = prefs?.audioQuality ?? 'best';
  const isVideo = trackType === TrackType.video || trackType === TrackType.both;

  if (isVideo) {
    if (!videoQuality || videoQuality === 'best') {
      return { trackType, id: 'best' };
    }
    const height = parseInt(videoQuality, 10);
    return isNaN(height) ? { trackType, id: 'best' } : { trackType, height };
  } else {
    if (!audioQuality || audioQuality === 'best') {
      return { trackType, id: 'best' };
    }
    const abr = parseInt(audioQuality, 10);
    return isNaN(abr) ? { trackType, id: 'best' } : { trackType, abr };
  }
}

export interface Preferences {
  paths: PathPreferences;
  recents: RecentPreferences;
  formats: FormatPreferences;
}

export const defaultPreferences: Preferences = {
  paths: defaultPathPreferences,
  recents: defaultRecentPreferences,
  formats: defaultFormatPreferences,
};
