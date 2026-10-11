<template>
  <div class="flex flex-col">
    <base-fieldset
      :legend="t('location.title')"
      :label="t('location.downloadDir.hint')"
    >
      <base-file-input
        class="max-w-4xl my-2"
        v-model="settings.output.downloadDir"
        :label="t('location.downloadDir.label')"
        :recent-values="recentValues.downloadDir"
        @clear-recents="clearRecents('downloadDir')"
        :clearable="false"
        show-recent
        directory
      />
      <p class="label text-sm mb-4">{{ t('location.downloadDir.hint') }}</p>
    </base-fieldset>

    <div class="divider my-0" />

    <preferences-directory
      v-model="preferencesDraft"
      :recent-values="recentValues"
      @clear-recents="clearRecents"
    />

    <div class="divider my-0" />

    <preferences-filename v-model="settings" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, toRaw, watch, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseFieldset from '../base/BaseFieldset.vue';
import BaseFileInput from '../base/BaseFileInput.vue';
import PreferencesDirectory from '../preferences/PreferencesDirectory.vue';
import PreferencesFilename from '../preferences/PreferencesFilename.vue';
import { Settings } from '../../tauri/types/config';
import { Preferences } from '../../tauri/types/preferences';
import { usePreferencesStore } from '../../stores/preferences';

const { t } = useI18n();
const preferencesStore = usePreferencesStore();
const settings = defineModel<Settings>({ required: true });

const injectedPreferences = inject<Ref<Preferences> | null>('preferencesDraft', null);
const localPreferences = ref<Preferences>(structuredClone<Preferences>(toRaw(preferencesStore.preferences)));
const preferencesDraft = injectedPreferences ?? localPreferences;

const recentValues = computed(() => ({
  downloadDir: preferencesStore.getRecentPaths('downloadDir'),
  videoDir: preferencesStore.getRecentPaths('videoDir'),
  audioDir: preferencesStore.getRecentPaths('audioDir'),
}));

watch(
  () => settings.value.output.downloadDir,
  (newFile, oldFile) => {
    if (newFile && newFile !== oldFile) {
      void preferencesStore.addRecentPath('downloadDir', newFile);
    }
  },
);

const clearRecents = (label: string) => {
  void preferencesStore.clearRecentPaths(label);
};
</script>
