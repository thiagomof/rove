<template>
  <SettingsSubtitles v-model="settings" />
</template>

<script setup lang="ts">
import { Settings } from '../../../tauri/types/config.ts';
import SettingsSubtitles from '../../../components/settings/SettingsSubtitles.vue';

const settings = defineModel<Settings>({ required: true });
</script>
