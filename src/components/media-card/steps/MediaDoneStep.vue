<template>
  <div class="card-body py-0 pr-0 grow w-full min-w-0 flex flex-col justify-between h-full">
    <div class="space-y-1.5">
      <h2 :title="group.title ?? group.url" class="card-title w-full block leading-7 overflow-hidden text-nowrap text-ellipsis text-base">
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

      <p v-if="singleSkippedReason" class="text-sm text-base-content/70">
        {{ singleSkippedReason }}
      </p>
      <p v-else-if="itemOutcomeDisplay" class="text-sm text-base-content/70">
        {{ t('media.steps.configure.metadata.items', { amount: group.total, details: itemOutcomeDisplay }) }}
      </p>

      <div class="w-full flex gap-3 pt-1">
        <div
            class="tooltip-bottom"
            :class="{ 'tooltip before:p-3': !groupDestination }"
            :data-tip="t('media.steps.done.undeterminedLocation')"
        >
          <button :disabled="!groupDestination" @click="revealFile" class="btn btn-primary btn-sm">
            {{ t('media.steps.done.showFolder') }}
          </button>
        </div>
        <div
            class="tooltip-bottom"
            :class="{ 'tooltip before:p-3': !groupDestination }"
            :data-tip="t('media.steps.done.undeterminedLocation')"
        >
          <button :disabled="!groupDestination" @click="openFile" class="btn btn-primary btn-sm">
            {{ group.isCombined ? t('media.steps.done.openFirst') : t('media.steps.done.open') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Barra de download mais fina e na parte inferior -->
    <div class="w-full mt-auto pt-2">
      <base-progress
          :id="group.id"
          :max="100"
          :value="100"
          :percentage="100"
      >
        {{ t('media.steps.done.complete') }}
      </base-progress>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed, PropType } from 'vue';
import BaseProgress from '../../base/BaseProgress.vue';
import { useOpener } from '../../../composables/useOpener';
import { useMediaDestinationStore } from '../../../stores/media/destination';
import { useMediaOptionsStore } from '../../../stores/media/options';
import { usePreferencesStore } from '../../../stores/preferences';
import { TrackType } from '../../../tauri/types/media';
import { FilmIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid';
import { Group } from '../../../tauri/types/group';
import { useI18n } from 'vue-i18n';
import { countSkippedDiagnostics, groupSkippedDiagnostics } from '../../../helpers/skippedDiagnostics.ts';
import { useMediaDiagnosticsStore } from '../../../stores/media/diagnostics.ts';

const { t } = useI18n();
const { openPath, revealPath } = useOpener();
const destinationStore = useMediaDestinationStore();
const diagnosticsStore = useMediaDiagnosticsStore();
const optionsStore = useMediaOptionsStore();
const preferencesStore = usePreferencesStore();

const { group } = defineProps({
  group: {
    type: Object as PropType<Group>,
    required: true,
  },
});

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

const groupDestination = computed(() => {
  const destination = destinationStore.getPrimaryDestination(group.id);
  return destination?.path;
});

const skippedCount = computed(() => countSkippedDiagnostics(diagnosticsStore.findDiagnosticsByGroupId(group.id)));
const skippedGroups = computed(() => groupSkippedDiagnostics(diagnosticsStore.findDiagnosticsByGroupId(group.id)));

const singleSkippedReason = computed(() => {
  if (group.isCombined || group.errored > 0 || skippedGroups.value.length === 0) {
    return '';
  }

  return skippedGroups.value[0]?.message ?? '';
});

const itemOutcomeDisplay = computed(() => {
  if (group.errored > 0 && skippedCount.value > 0) {
    return t('media.steps.configure.metadata.failedAndSkippedCount', {
      failed: group.errored,
      skipped: skippedCount.value,
    });
  }

  if (group.errored > 0) {
    return t('media.steps.configure.metadata.failedCount', { amount: group.errored });
  }

  if (skippedCount.value > 0) {
    return t('media.steps.configure.metadata.skippedCount', { amount: skippedCount.value });
  }

  return '';
});

const openFile = async () => {
  const destination = groupDestination.value;
  if (!destination) return;
  await openPath(destination);
};

const revealFile = async () => {
  const destination = groupDestination.value;
  if (!destination) return;
  await revealPath(destination);
};

</script>
