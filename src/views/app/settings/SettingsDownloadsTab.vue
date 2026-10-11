<template>
  <div class="flex flex-col">
    <SettingsFormat />
    <div class="divider my-0" />
    <SettingsLocation v-model="settings" />
    <div class="divider my-0" />
    <SettingsOutput v-model="settings" />
    <div class="divider my-0" />
    <SettingsPerformance v-model="settings" />
    <div class="divider my-0" />
    <SettingsSponsorBlock v-model="settings" />
  </div>
</template>

<script setup lang="ts">
import { Settings } from '../../../tauri/types/config.ts';
import SettingsFormat from '../../../components/settings/SettingsFormat.vue';
import SettingsLocation from '../../../components/settings/SettingsLocation.vue';
import SettingsOutput from '../../../components/settings/SettingsOutput.vue';
import SettingsPerformance from '../../../components/settings/SettingsPerformance.vue';
import SettingsSponsorBlock from '../../../components/settings/SettingsSponsorBlock.vue';

const settings = defineModel<Settings>({ required: true });
</script>
