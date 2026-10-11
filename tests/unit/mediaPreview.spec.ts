import { describe, expect, it } from 'vitest';
import { getMediaPreviewInfo } from '../../src/helpers/mediaPreview';

describe('mediaPreview helper', () => {
  it('returns null for null, undefined or empty input', () => {
    expect(getMediaPreviewInfo(null)).toBeNull();
    expect(getMediaPreviewInfo(undefined)).toBeNull();
    expect(getMediaPreviewInfo('')).toBeNull();
    expect(getMediaPreviewInfo('   ')).toBeNull();
  });

  it('detects standard YouTube watch URLs', () => {
    const result = getMediaPreviewInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result).toEqual({
      type: 'iframe',
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
      provider: 'youtube',
    });
  });

  it('detects short youtu.be URLs', () => {
    const result = getMediaPreviewInfo('https://youtu.be/dQw4w9WgXcQ');
    expect(result).toEqual({
      type: 'iframe',
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
      provider: 'youtube',
    });
  });

  it('detects YouTube shorts URLs', () => {
    const result = getMediaPreviewInfo('https://www.youtube.com/shorts/dQw4w9WgXcQ');
    expect(result).toEqual({
      type: 'iframe',
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
      provider: 'youtube',
    });
  });

  it('detects Vimeo URLs', () => {
    const result = getMediaPreviewInfo('https://vimeo.com/76979871');
    expect(result).toEqual({
      type: 'iframe',
      url: 'https://player.vimeo.com/video/76979871?autoplay=1',
      provider: 'vimeo',
    });
  });

  it('detects SoundCloud URLs', () => {
    const result = getMediaPreviewInfo('https://soundcloud.com/artist/track-name');
    expect(result).toEqual({
      type: 'iframe',
      url: 'https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fartist%2Ftrack-name&auto_play=true&show_artwork=true&visual=true',
      provider: 'soundcloud',
    });
  });

  it('detects direct video and audio URLs', () => {
    const videoResult = getMediaPreviewInfo('https://example.com/media/sample.mp4');
    expect(videoResult).toEqual({
      type: 'video',
      url: 'https://example.com/media/sample.mp4',
      provider: 'direct',
    });

    const audioResult = getMediaPreviewInfo('https://example.com/media/sample.mp3');
    expect(audioResult).toEqual({
      type: 'audio',
      url: 'https://example.com/media/sample.mp3',
      provider: 'direct',
    });
  });

  it('returns null for unsupported or non-embeddable URLs', () => {
    expect(getMediaPreviewInfo('https://example.com/page')).toBeNull();
    expect(getMediaPreviewInfo('invalid-url')).toBeNull();
  });
});
