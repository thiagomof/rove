<template>
  <figure class="shrink-0 w-64 aspect-video rounded-md overflow-hidden bg-base-100 relative select-none group/cover">
    <!-- 1. MODO REPRODUÇÃO ATIVA -->
    <div v-if="isPlaying" class="w-full h-full relative bg-black">
      <!-- Botões de controle no topo (Fechar e Abrir Externamente) -->
      <div class="absolute top-2 right-2 z-30 flex items-center gap-1.5">
        <button
          v-if="hasExternalTarget"
          type="button"
          class="btn btn-circle btn-xs bg-black/70 hover:bg-primary text-white border-0 shadow-md backdrop-blur-sm transition-colors"
          :title="isDone ? t('media.card.player.openExternal') : t('media.card.player.openInBrowser')"
          @click.stop="openExternalTarget"
        >
          <arrow-top-right-on-square-icon class="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          class="btn btn-circle btn-xs bg-black/70 hover:bg-error text-white border-0 shadow-md backdrop-blur-sm transition-colors"
          :title="t('media.card.player.closePlayer')"
          @click.stop="stopPlayback"
        >
          <x-mark-icon class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Badge de modo de reprodução -->
      <div class="absolute top-2 left-2 z-30 pointer-events-none">
        <span
          class="badge badge-xs text-white font-semibold border-0 shadow-sm backdrop-blur-md px-1.5 py-1.5"
          :class="isDone ? 'bg-emerald-600/90' : 'bg-primary/90'"
        >
          {{ isDone ? t('media.card.player.localFile') : t('media.card.player.onlinePreview') }}
        </span>
      </div>

      <!-- CASO A: Vídeo local baixado -->
      <template v-if="isDone && !isAudio">
        <div v-if="playbackError" class="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-base-300/95 text-base-content">
          <p class="text-xs font-medium text-warning mb-2 line-clamp-2">
            {{ t('media.card.player.unsupportedFormat') }}
          </p>
          <button
            type="button"
            class="btn btn-primary btn-xs gap-1"
            @click.stop="openExternalTarget"
          >
            <arrow-top-right-on-square-icon class="w-3 h-3" />
            {{ t('media.card.player.openExternal') }}
          </button>
        </div>
        <video
          v-else
          ref="videoElementRef"
          :src="localAssetUrl"
          controls
          autoplay
          playsinline
          class="w-full h-full object-contain bg-black"
          @error="onVideoError"
        />
      </template>

      <!-- CASO B: Áudio local baixado -->
      <template v-else-if="isDone && isAudio">
        <div class="w-full h-full relative overflow-hidden flex flex-col items-center justify-center">
          <img
            :src="group.thumbnail ?? placeholderUrl"
            :alt="group.title ?? ''"
            class="absolute inset-0 w-full h-full object-cover filter blur-md brightness-40 scale-110"
            @error="setPlaceholderImage"
          />
          <div class="relative z-20 flex flex-col items-center gap-1 px-4 text-center">
            <div class="flex items-end justify-center gap-1 h-6 mb-1">
              <span class="w-1 bg-primary rounded-full animate-bounce h-3" style="animation-delay: 0ms;" />
              <span class="w-1 bg-primary rounded-full animate-bounce h-5" style="animation-delay: 150ms;" />
              <span class="w-1 bg-primary rounded-full animate-bounce h-4" style="animation-delay: 300ms;" />
              <span class="w-1 bg-primary rounded-full animate-bounce h-6" style="animation-delay: 75ms;" />
              <span class="w-1 bg-primary rounded-full animate-bounce h-3.5" style="animation-delay: 225ms;" />
            </div>
            <p class="text-xs font-semibold text-white drop-shadow truncate max-w-[200px]">
              {{ group.title ?? group.url }}
            </p>
          </div>
          <audio
            ref="audioElementRef"
            :src="localAssetUrl"
            controls
            autoplay
            class="w-[90%] max-w-[230px] h-8 absolute bottom-2 left-1/2 -translate-x-1/2 z-20 shadow-lg rounded"
          />
        </div>
      </template>

      <!-- CASO C: Prévia online (YouTube, Vimeo, SoundCloud ou mídia direta) -->
      <template v-else-if="previewInfo">
        <iframe
          v-if="previewInfo.type === 'iframe'"
          :src="previewInfo.url"
          class="w-full h-full border-0 bg-black"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        />
        <video
          v-else-if="previewInfo.type === 'video'"
          :src="previewInfo.url"
          controls
          autoplay
          playsinline
          class="w-full h-full object-contain bg-black"
        />
        <div v-else class="w-full h-full relative flex flex-col items-center justify-center">
          <img
            :src="group.thumbnail ?? placeholderUrl"
            class="absolute inset-0 w-full h-full object-cover filter blur-sm brightness-50"
            @error="setPlaceholderImage"
          />
          <audio
            :src="previewInfo.url"
            controls
            autoplay
            class="w-[90%] max-w-[230px] h-8 relative z-20"
          />
        </div>
      </template>
    </div>

    <!-- 2. MODO CAPA / THUMBNAIL EM REPOUSO -->
    <template v-else>
      <img
        :src="group.thumbnail ?? placeholderUrl"
        :alt="t('media.view.thumbnailAlt', { title: group.title ?? '' })"
        class="object-cover w-full h-full transition-transform duration-300 group-hover/cover:scale-105"
        @error="setPlaceholderImage"
      />

      <!-- Badge de status (Local ou Prévia disponível) -->
      <div v-if="isDone" class="absolute top-2 left-2 z-10 pointer-events-none">
        <span class="badge badge-xs bg-emerald-600/90 text-white font-semibold border-0 shadow backdrop-blur-md px-1.5 py-1.5 gap-1 inline-flex items-center">
          <film-icon v-if="!isAudio" class="w-2.5 h-2.5" />
          <musical-note-icon v-else class="w-2.5 h-2.5" />
          {{ t('media.card.player.localFile') }}
        </span>
      </div>
      <div v-else-if="canPreview" class="absolute top-2 left-2 z-10 pointer-events-none opacity-0 group-hover/cover:opacity-100 transition-opacity">
        <span class="badge badge-xs bg-primary/90 text-primary-content font-semibold border-0 shadow backdrop-blur-md px-1.5 py-1.5">
          {{ t('media.card.player.onlinePreview') }}
        </span>
      </div>

      <!-- Badge de duração -->
      <div
        v-if="durationDisplay"
        class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-medium shadow pointer-events-none z-10"
      >
        {{ durationDisplay }}
      </div>

      <!-- Botão Play em overlay -->
      <div
        v-if="canPlayAny"
        class="absolute inset-0 flex items-center justify-center bg-black/25 group-hover/cover:bg-black/45 transition-colors duration-200 z-20 cursor-pointer"
        :title="playTooltip"
        @click.stop="startPlayback"
      >
        <button
          type="button"
          class="btn btn-circle bg-base-100/90 hover:bg-primary text-base-content hover:text-primary-content border-0 backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
          :class="{ 'opacity-90 group-hover/cover:opacity-100': isDone, 'opacity-0 group-hover/cover:opacity-100': !isDone }"
          :title="playTooltip"
        >
          <play-icon class="w-6 h-6 ml-0.5" />
        </button>
      </div>
    </template>
  </figure>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { convertFileSrc } from '@tauri-apps/api/core';
import { ArrowTopRightOnSquareIcon, FilmIcon, MusicalNoteIcon, PlayIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import placeholderUrl from '../../assets/placeholder.png';
import { Group } from '../../tauri/types/group';
import { TrackType } from '../../tauri/types/media';
import { MediaState, useMediaStateStore } from '../../stores/media/state';
import { useMediaDestinationStore } from '../../stores/media/destination';
import { useMediaOptionsStore } from '../../stores/media/options';
import { usePreferencesStore } from '../../stores/preferences';
import { useMediaPlaybackStore } from '../../stores/mediaPlayback';
import { formatDuration } from '../../composables/useDuration';
import { useOpener } from '../../composables/useOpener';
import { getMediaPreviewInfo } from '../../helpers/mediaPreview';

const { t } = useI18n();
const { openPath, openUrl } = useOpener();

const stateStore = useMediaStateStore();
const destinationStore = useMediaDestinationStore();
const optionsStore = useMediaOptionsStore();
const preferencesStore = usePreferencesStore();
const playbackStore = useMediaPlaybackStore();

const props = defineProps({
  group: {
    type: Object as PropType<Group>,
    required: true,
  },
});

const videoElementRef = ref<HTMLVideoElement | null>(null);
const audioElementRef = ref<HTMLAudioElement | null>(null);
const playbackError = ref<boolean>(false);

const groupState = computed(() => stateStore.getGroupState(props.group.id));
const destination = computed(() => destinationStore.getPrimaryDestination(props.group.id));

const isDone = computed(() => {
  return groupState.value === MediaState.done && !!destination.value?.path;
});

const localFilePath = computed(() => destination.value?.path ?? '');

const localAssetUrl = computed(() => {
  if (!localFilePath.value) return '';
  try {
    if (typeof window !== 'undefined' && (window as unknown as { __TAURI_INTERNALS__?: { convertFileSrc?: unknown } }).__TAURI_INTERNALS__?.convertFileSrc) {
      return convertFileSrc(localFilePath.value);
    }
  } catch {
    // fallback
  }
  return localFilePath.value;
});

const isAudio = computed(() => {
  if (localFilePath.value) {
    const ext = localFilePath.value.split('.').pop()?.toLowerCase();
    if (ext && ['mp3', 'm4a', 'aac', 'flac', 'wav', 'ogg', 'opus'].includes(ext)) {
      return true;
    }
  }
  const options = optionsStore.getOptions(props.group.id);
  if (options?.trackType) {
    return options.trackType === TrackType.audio;
  }
  const prefTrack = preferencesStore.preferences?.formats?.trackType;
  return prefTrack === TrackType.audio;
});

const previewInfo = computed(() => getMediaPreviewInfo(props.group.url));

const canPreview = computed(() => !isDone.value && !!previewInfo.value);

const canPlayAny = computed(() => isDone.value || canPreview.value);

const isPlaying = computed(() => playbackStore.isPlaying(props.group.id));

const durationDisplay = computed(() => {
  if (!props.group.duration || props.group.duration <= 0) return '';
  return formatDuration(props.group.duration);
});

const playTooltip = computed(() => {
  if (isDone.value) {
    return t('media.card.player.playDownloaded');
  }
  return t('media.card.player.previewOnline');
});

const hasExternalTarget = computed(() => {
  return (isDone.value && !!localFilePath.value) || (!isDone.value && !!props.group.url);
});

const startPlayback = () => {
  playbackError.value = false;
  playbackStore.playGroup(props.group.id);
};

const stopPlayback = () => {
  playbackError.value = false;
  if (videoElementRef.value) {
    videoElementRef.value.pause();
  }
  if (audioElementRef.value) {
    audioElementRef.value.pause();
  }
  playbackStore.stopGroup(props.group.id);
};

const openExternalTarget = async () => {
  if (isDone.value && localFilePath.value) {
    await openPath(localFilePath.value);
  } else if (props.group.url) {
    await openUrl(props.group.url);
  }
};

const onVideoError = () => {
  playbackError.value = true;
};

const setPlaceholderImage = (event: Event): void => {
  if (event.target instanceof HTMLImageElement) {
    event.target.src = placeholderUrl;
  }
};

onBeforeUnmount(() => {
  if (isPlaying.value) {
    stopPlayback();
  }
});
</script>
