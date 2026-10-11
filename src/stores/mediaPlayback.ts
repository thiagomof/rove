import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMediaPlaybackStore = defineStore('mediaPlayback', () => {
  const activeGroupId = ref<string | null>(null);

  const isPlaying = (groupId: string): boolean => activeGroupId.value === groupId;

  const playGroup = (groupId: string): void => {
    activeGroupId.value = groupId;
  };

  const stopGroup = (groupId: string): void => {
    if (activeGroupId.value === groupId) {
      activeGroupId.value = null;
    }
  };

  const toggleGroup = (groupId: string): void => {
    if (activeGroupId.value === groupId) {
      activeGroupId.value = null;
    } else {
      activeGroupId.value = groupId;
    }
  };

  const stopAll = (): void => {
    activeGroupId.value = null;
  };

  return {
    activeGroupId,
    isPlaying,
    playGroup,
    stopGroup,
    toggleGroup,
    stopAll,
  };
});
