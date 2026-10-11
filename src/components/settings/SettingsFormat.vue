<template>
  <base-fieldset
    :legend="t('settings.format.legend')"
    :label="t('settings.format.legendLabel')"
  >
    <!-- Media Type Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 my-2" role="radiogroup" :aria-label="t('settings.format.legend')">
      <div
        v-for="item in options"
        :key="item.value"
        role="radio"
        tabindex="0"
        :aria-checked="selectedTrackType === item.value"
        class="card p-4 cursor-pointer transition-all duration-200 select-none flex flex-col justify-between outline-none focus:outline-none focus-visible:outline-none"
        :class="selectedTrackType === item.value
          ? 'border-2 border-[#0075fa] bg-[#0075fa]/10'
          : 'border border-transparent bg-[#f0f0f0] text-slate-800 hover:bg-[#e2e2e2] dark:bg-base-200/70 dark:text-base-content dark:hover:bg-base-200'"
        @click="select(item.value)"
        @keydown.enter.prevent="select(item.value)"
        @keydown.space.prevent="select(item.value)"
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <component
              :is="item.icon"
              class="w-6 h-6"
              :class="selectedTrackType === item.value ? 'text-[#0075fa]' : 'text-base-content/70'"
            />
            <span
              class="badge badge-sm font-semibold"
              :class="selectedTrackType === item.value ? 'bg-[#0075fa] text-white border-[#0075fa]' : 'badge-ghost'"
            >
              {{ item.badge }}
            </span>
          </div>
          <div>
            <h3
              class="font-semibold text-base"
              :class="selectedTrackType === item.value ? 'text-[#0075fa]' : 'text-base-content'"
            >
              {{ item.title }}
            </h3>
            <p class="text-xs text-base-content/70 mt-1 leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>

        <div class="mt-4 pt-2 border-t border-base-content/10 flex items-center justify-between text-xs">
          <span class="text-base-content/70 font-medium">
            {{ selectedTrackType === item.value ? t('settings.format.selected') : t('settings.format.select') }}
          </span>
          <div
            class="w-4 h-4 rounded-full border flex items-center justify-center transition-colors"
            :class="selectedTrackType === item.value ? 'border-[#0075fa] bg-[#0075fa]' : 'border-base-content/40 bg-white/50 dark:bg-transparent'"
          >
            <div v-if="selectedTrackType === item.value" class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quality Selection Section -->
    <div class="mt-5 pt-4 border-t border-base-content/10">
      <div class="flex flex-col gap-1 mb-3">
        <h4 class="text-sm font-semibold text-base-content">
          {{ isVideoLike ? t('settings.format.quality.videoLabel') : t('settings.format.quality.audioLabel') }}
        </h4>
        <p class="text-xs text-base-content/70">
          {{ t('settings.format.quality.description') }}
        </p>
      </div>

      <!-- Quality Options Grid -->
      <div
        class="grid gap-2"
        :class="isVideoLike ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-7' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'"
        role="radiogroup"
        :aria-label="t('settings.format.quality.title')"
      >
        <button
          v-for="q in (isVideoLike ? videoQualityOptions : audioQualityOptions)"
          :key="q.value"
          type="button"
          role="radio"
          :aria-checked="currentQuality === q.value"
          class="btn flex flex-col items-center justify-center h-auto py-2.5 px-2 transition-all rounded-lg text-center outline-none focus:outline-none focus-visible:outline-none"
          :class="currentQuality === q.value
            ? 'btn-primary font-semibold'
            : 'btn-unselected font-medium'"
          @click="setQuality(q.value)"
        >
          <div class="flex items-center gap-1">
            <check-icon v-if="currentQuality === q.value" class="w-3.5 h-3.5 shrink-0" />
            <span class="text-xs font-bold leading-tight">{{ q.label }}</span>
          </div>
          <span class="text-[10px] opacity-75 mt-0.5 line-clamp-1 truncate max-w-full">
            {{ q.desc }}
          </span>
        </button>
      </div>
    </div>
  </base-fieldset>
</template>

<script setup lang="ts">
import { computed, inject, ref, toRaw, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseFieldset from '../base/BaseFieldset.vue';
import { TrackType } from '../../tauri/types/media';
import { formatPreferencesToDownloadOptions, Preferences } from '../../tauri/types/preferences';
import { usePreferencesStore } from '../../stores/preferences';
import { useMediaOptionsStore } from '../../stores/media/options';
import { FilmIcon, VideoCameraIcon, MusicalNoteIcon, CheckIcon } from '@heroicons/vue/24/solid';

const { t } = useI18n();
const preferencesStore = usePreferencesStore();
const optionsStore = useMediaOptionsStore();

const injectedPreferences = inject<Ref<Preferences> | null>('preferencesDraft', null);
const localPreferences = ref<Preferences>(structuredClone<Preferences>(toRaw(preferencesStore.preferences)));
const preferencesDraft = injectedPreferences ?? localPreferences;

const isVideoLike = computed(() => {
  const tt = preferencesDraft.value.formats.trackType;
  return tt === TrackType.both || tt === TrackType.video;
});

const currentVideoQuality = computed(() => preferencesDraft.value.formats.videoQuality ?? 'best');
const currentAudioQuality = computed(() => preferencesDraft.value.formats.audioQuality ?? 'best');

const currentQuality = computed(() => {
  return isVideoLike.value ? currentVideoQuality.value : currentAudioQuality.value;
});

function syncGlobalOptions() {
  optionsStore.applyGlobalOptions(formatPreferencesToDownloadOptions(preferencesDraft.value.formats));
}

const selectedTrackType = computed({
  get: () => preferencesDraft.value.formats.trackType,
  set: (val: TrackType) => {
    preferencesDraft.value.formats.trackType = val;
    syncGlobalOptions();
  },
});

const select = (value: TrackType) => {
  selectedTrackType.value = value;
};

const setQuality = (value: string) => {
  if (isVideoLike.value) {
    preferencesDraft.value.formats.videoQuality = value;
  } else {
    preferencesDraft.value.formats.audioQuality = value;
  }
  syncGlobalOptions();
};

const videoQualityOptions = computed(() => [
  { value: 'best', label: t('settings.format.quality.bestShort'), desc: 'Original' },
  { value: '2160', label: '2160p', desc: '4K' },
  { value: '1440', label: '1440p', desc: '2K' },
  { value: '1080', label: '1080p', desc: 'Full HD' },
  { value: '720', label: '720p', desc: 'HD' },
  { value: '480', label: '480p', desc: 'SD' },
  { value: '360', label: '360p', desc: 'Baixa' },
]);

const audioQualityOptions = computed(() => [
  { value: 'best', label: t('settings.format.quality.bestShort'), desc: 'Original' },
  { value: '320', label: '320k', desc: '320 kbps' },
  { value: '256', label: '256k', desc: '256 kbps' },
  { value: '192', label: '192k', desc: '192 kbps' },
  { value: '128', label: '128k', desc: '128 kbps' },
]);

const videoBadge = computed(() => {
  const q = currentVideoQuality.value;
  return (!q || q === 'best') ? t('settings.format.quality.bestShort') : `${q}p`;
});

const audioBadge = computed(() => {
  const q = currentAudioQuality.value;
  return (!q || q === 'best') ? t('settings.format.quality.bestShort') : `${q} kbps`;
});

const options = computed(() => [
  {
    value: TrackType.both,
    title: t('settings.format.both.title'),
    description: t('settings.format.both.description'),
    badge: videoBadge.value,
    icon: FilmIcon,
  },
  {
    value: TrackType.video,
    title: t('settings.format.video.title'),
    description: t('settings.format.video.description'),
    badge: videoBadge.value,
    icon: VideoCameraIcon,
  },
  {
    value: TrackType.audio,
    title: t('settings.format.audio.title'),
    description: t('settings.format.audio.description'),
    badge: audioBadge.value,
    icon: MusicalNoteIcon,
  },
]);
</script>
