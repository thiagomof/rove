<template>
  <footer v-if="isDownloading" class="p-3 bg-base-300 flex flex-col justify-center w-full shadow-lg">
    <base-progress :max="progress.total" :value="progress.done" id="total">
      {{ t('layout.footer.progress.downloading', { done: progress.done, total: progress.total }) }}
    </base-progress>
  </footer>
</template>

<script setup lang="ts">
import BaseProgress from './base/BaseProgress.vue';
import { computed } from 'vue';
import { useMediaProgressStore } from '../stores/media/progress';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const progressStore = useMediaProgressStore();

const progress = computed(() => {
  return progressStore.findAllProgress();
});

const isDownloading = computed(() => {
  return (progress.value.downloading ?? 0) > 0;
});
</script>
