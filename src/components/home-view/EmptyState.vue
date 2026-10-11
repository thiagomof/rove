<template>
  <div class="flex flex-col items-center gap-3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute opacity-30 select-none pointer-events-none">
      <ArrowUpIcon class="w-32"/>

      <p class="text-3xl font-normal text-center">
        {{ t('components.base.emptyState.title') }}
      </p>

      <p class="text-base font-light text-center">
        {{ t('components.base.emptyState.subtitle') }}
      </p>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpIcon } from '@heroicons/vue/24/solid';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
