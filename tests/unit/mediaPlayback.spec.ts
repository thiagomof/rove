import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useMediaPlaybackStore } from '../../src/stores/mediaPlayback';

describe('mediaPlayback store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with no active group', () => {
    const store = useMediaPlaybackStore();
    expect(store.activeGroupId).toBeNull();
    expect(store.isPlaying('group-1')).toBe(false);
  });

  it('sets and checks playing group', () => {
    const store = useMediaPlaybackStore();
    store.playGroup('group-1');
    expect(store.activeGroupId).toBe('group-1');
    expect(store.isPlaying('group-1')).toBe(true);
    expect(store.isPlaying('group-2')).toBe(false);
  });

  it('switches playing group when a new group starts playing', () => {
    const store = useMediaPlaybackStore();
    store.playGroup('group-1');
    expect(store.isPlaying('group-1')).toBe(true);

    store.playGroup('group-2');
    expect(store.isPlaying('group-1')).toBe(false);
    expect(store.isPlaying('group-2')).toBe(true);
  });

  it('stops playing group', () => {
    const store = useMediaPlaybackStore();
    store.playGroup('group-1');
    store.stopGroup('group-1');
    expect(store.activeGroupId).toBeNull();
    expect(store.isPlaying('group-1')).toBe(false);
  });

  it('does not stop if stopping a different group', () => {
    const store = useMediaPlaybackStore();
    store.playGroup('group-1');
    store.stopGroup('group-2');
    expect(store.isPlaying('group-1')).toBe(true);
  });

  it('toggles playback for a group', () => {
    const store = useMediaPlaybackStore();
    store.toggleGroup('group-1');
    expect(store.isPlaying('group-1')).toBe(true);

    store.toggleGroup('group-1');
    expect(store.isPlaying('group-1')).toBe(false);
    expect(store.activeGroupId).toBeNull();
  });

  it('stops all playback', () => {
    const store = useMediaPlaybackStore();
    store.playGroup('group-1');
    store.stopAll();
    expect(store.activeGroupId).toBeNull();
  });
});
