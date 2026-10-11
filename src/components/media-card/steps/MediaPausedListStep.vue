<template>
  <div class="card-body py-0 pr-0 grow w-full min-w-0 flex flex-col justify-between h-full">
    <div class="space-y-1">
      <h2
          :title="group.title ?? group.url"
          class="card-title block leading-7 overflow-hidden whitespace-nowrap overflow-ellipsis text-base"
      >
        {{ group.title ?? group.url }}
      </h2>

      <!-- Sinalização do tipo de arquivo em baixo do título -->
      <div class="flex items-center gap-2 pt-0.5">
        <span class="badge badge-sm font-semibold inline-flex items-center gap-1 bg-base-100 text-base-content/85 border-base-content/15">
          <film-icon v-if="trackType === TrackType.both || trackType === TrackType.video" class="w-3 h-3 text-primary shrink-0" />
          <musical-note-icon v-else class="w-3 h-3 text-primary shrink-0" />
          {{ trackTypeLabel }}
        </span>
      </div>

      <div class="flex items-center gap-4 text-xs text-base-content/70">
        <span>
          {{ t('media.steps.paused.metadata.etaItems', { n: remainingItems }) }}
        </span>
      </div>
    </div>

    <!-- Barra de download pausado de lista fina e refinada na parte de baixo do card -->
    <div class="w-full mt-auto pt-2">
      <base-progress
          :id="group.id"
          :max="100"
          :value="percent"
          variant="warning"
      >
        {{
          t('media.steps.paused.progressList', {
            percentage: percent.toFixed(1),
            done: progress?.done ?? 0,
            total: progress?.total ?? 0,
          })
        }}
      </base-progress>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { useMediaProgressStore } from '../../../stores/media/progress';
import { useMediaOptionsStore } from '../../../stores/media/options';
import { usePreferencesStore } from '../../../stores/preferences';
import { TrackType } from '../../../tauri/types/media';
import { FilmIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid';
import BaseProgress from '../../base/BaseProgress.vue';
import { computeGroupPercentage } from '../../../helpers/progress';
import { Group } from '../../../tauri/types/group';
import { useI18n } from 'vue-i18n';

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

const store = useMediaProgressStore();
const progress = computed(() => store.findGroupProgress(group.id));

const percent = computed(() => {
  return computeGroupPercentage(progress.value);
});

const remainingItems = computed(() => {
  if (!progress.value) return group.total;
  return Math.max(0, group.total - (progress.value.done ?? 0));
});

</script>
