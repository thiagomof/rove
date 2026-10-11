<template>
  <div class="card-body py-0 pr-0 grow w-full min-w-0 flex flex-col justify-between h-full">
    <div class="space-y-1">
      <h2 :title="group.url" class="card-title block leading-7 overflow-hidden text-nowrap text-ellipsis text-base">
        {{ group.url }}
      </h2>
      <!-- Sinalização do tipo de arquivo em baixo do título -->
      <div class="flex items-center gap-2 pt-0.5">
        <span class="badge badge-sm font-semibold inline-flex items-center gap-1 bg-base-100 text-base-content/85 border-base-content/15">
          <film-icon v-if="trackType === TrackType.both || trackType === TrackType.video" class="w-3 h-3 text-primary shrink-0" />
          <musical-note-icon v-else class="w-3 h-3 text-primary shrink-0" />
          {{ trackTypeLabel }}
        </span>
      </div>
    </div>

    <!-- Barra de download/fetch fina e refinada na parte de baixo do card -->
    <div class="w-full mt-auto pt-2">
      <base-progress
          :id="group.id"
      >
        {{ t('media.steps.fetch.progressLabel') }}
      </base-progress>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import BaseProgress from '../../base/BaseProgress.vue';
import { Group } from '../../../tauri/types/group';
import { useI18n } from 'vue-i18n';
import { useMediaOptionsStore } from '../../../stores/media/options';
import { usePreferencesStore } from '../../../stores/preferences';
import { TrackType } from '../../../tauri/types/media';
import { FilmIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid';

const { t } = useI18n();

const { group } = defineProps({
  group: {
    type: Object as PropType<Group>,
    required: true,
  },
});

const optionsStore = useMediaOptionsStore();
const preferencesStore = usePreferencesStore();

const trackType = computed<TrackType>(() => {
  const options = optionsStore.getOptions(group.id);
  if (options?.trackType) return options.trackType;
  return preferencesStore.preferences?.formats?.trackType ?? TrackType.both;
});

const trackTypeLabel = computed(() => {
  return trackType.value === TrackType.audio
    ? t('media.steps.configure.trackTypes.audio')
    : t('media.steps.configure.trackTypes.video');
});
</script>
