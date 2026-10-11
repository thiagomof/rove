<template>
  <header class="relative z-20 bg-base-200 flex flex-col w-full">
    <!-- Barra de títulos perfeitamente alinhada com os botões de semáforo do macOS -->
    <div
      data-tauri-drag-region
      class="relative flex items-center justify-between pl-20 pr-3.5 h-9 select-none w-full shrink-0"
    >
      <!-- Nome do app perfeitamente centralizado no eixo dos semáforos -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="text-xs font-medium tracking-wider text-base-content/75 select-none leading-none">
          {{ appName }}
        </span>
      </div>

      <!-- Espaço reservado para o semáforo à esquerda -->
      <div class="w-7 h-7 pointer-events-none"></div>

      <!-- Botão de configurações alinhado à altura dos botões de semáforo -->
      <div class="relative z-10 flex items-center">
        <router-link
          class="text-base-content/65 hover:text-base-content hover:bg-base-content/10 transition-colors rounded-lg flex items-center justify-center w-7 h-7 focus:outline-none"
          active-class="text-primary bg-primary/10"
          :title="t('layout.header.nav.settings')"
          :to="{ name: 'settings.downloads' }"
        >
          <span class="sr-only">{{ t('layout.header.nav.settings') }}</span>
          <cog8-tooth-icon class="w-4 h-4" />
        </router-link>
      </div>
    </div>

    <!-- Barra de inserção de link e download -->
    <div class="flex justify-center px-4 pt-1 pb-3 w-full">
      <form @submit.prevent="handleSubmit" class="relative flex items-center w-full max-w-160 bg-base-100 rounded-2xl border border-base-content/15 transition-all duration-200 focus-within:border-base-content/30 hover:border-base-content/30" autocomplete="off">
        <link-icon class="w-5 h-5 ml-4 text-base-content/40 shrink-0 pointer-events-none" />
        <input
            v-model="url"
            id="queue-url-input"
            name="URL input to queue a video or playlist"
            class="w-full bg-transparent px-3 py-3 text-sm text-base-content outline-none placeholder:text-base-content/40"
            :placeholder="inputPlaceholder"
            type="text"
            inputmode="url"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            ref="input"
        />
        <div class="flex items-center p-1.5 pr-2 shrink-0">
          <div class="inline-flex items-center bg-primary rounded-xl shadow-none border-none">
            <button
                id="queue-action-button"
                type="button"
                class="btn btn-primary px-5 h-10 text-sm font-semibold border-none shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none transition-all duration-150 active:scale-95 flex items-center gap-1.5 rounded-l-xl rounded-r-none"
                @click="handleActionClick"
            >
              <arrow-down-tray-icon v-if="actionType === 'download'" class="w-4.5 h-4.5 inline" />
              <clipboard-document-check-icon v-else class="w-4.5 h-4.5 inline" />
              <span>{{ actionButtonText }}</span>
            </button>

            <!-- Divisor sutil entre os botões -->
            <div class="w-px h-6 bg-primary-content/25 shrink-0 pointer-events-none"></div>

            <!-- Dropdown para seleção de tipo de download -->
            <div
              ref="dropdownRef"
              class="dropdown dropdown-end"
              :class="{ 'dropdown-open': isDropdownOpen }"
            >
              <button
                  type="button"
                  tabindex="0"
                  role="button"
                  id="queue-track-type-button"
                  class="btn btn-primary px-2.5 h-10 border-none shadow-none outline-none focus:outline-none focus:ring-0 rounded-l-none rounded-r-xl flex items-center gap-1 !pointer-events-auto"
                  :title="trackTypeLabel"
                  @click.stop="toggleDropdown"
              >
                <film-icon v-if="selectedTrackType !== TrackType.audio" class="w-4 h-4" />
                <musical-note-icon v-else class="w-4 h-4" />
                <chevron-down-icon class="w-3 h-3 opacity-80" />
              </button>
              <ul
                  tabindex="0"
                  class="dropdown-content menu z-50 p-1.5 shadow-xl bg-base-100 rounded-box w-44 border border-base-content/10 text-xs font-normal text-base-content mt-1 gap-0.5"
                  @click="closeOnItemClick"
              >
                <li v-for="option in trackTypeOptions" :key="option.value">
                  <button
                      type="button"
                      class="flex items-center justify-between py-2 px-3 rounded-lg"
                      :class="{ 'active': option.value === TrackType.both ? selectedTrackType !== TrackType.audio : selectedTrackType === TrackType.audio }"
                      @click="setTrackType(option.value)"
                  >
                    <div class="flex items-center gap-2">
                      <component :is="option.icon" class="w-4 h-4 text-primary shrink-0" />
                      <span class="font-medium">{{ option.label }}</span>
                    </div>
                    <check-icon v-if="option.value === TrackType.both ? selectedTrackType !== TrackType.audio : selectedTrackType === TrackType.audio" class="w-3.5 h-3.5 stroke-2 shrink-0" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  </header>
</template>

<script setup lang="ts">

import {
  ArrowDownTrayIcon,
  CheckIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  Cog8ToothIcon,
  LinkIcon,
} from '@heroicons/vue/24/outline';
import { FilmIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid';
import { useMediaStore } from '../stores/media/media';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { useClipboard } from '../composables/useClipboard';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../stores/settings';
import { usePreferencesStore } from '../stores/preferences';
import { useMediaOptionsStore } from '../stores/media/options';
import { TrackType } from '../tauri/types/media';
import { formatPreferencesToDownloadOptions } from '../tauri/types/preferences';
import { isValidUrl } from '../helpers/url.ts';
import { useWatchClipboardStore } from '../stores/watchClipboard.ts';
import { useToastStore } from '../stores/toast.ts';
import {
  getUrlImportToast,
  parseUrlInputText,
} from '../helpers/urlImport.ts';

const appName = 'Rove';
const { t } = useI18n();
const router = useRouter();
const mediaStore = useMediaStore();
const toastStore = useToastStore();
const preferencesStore = usePreferencesStore();
const optionsStore = useMediaOptionsStore();

const settingsStore = useSettingsStore();
const watchClipboardStore = useWatchClipboardStore();

const doPolling = computed(() => settingsStore.settings.input.autoFillClipboard || watchClipboardStore.isActive);

const { content: clipboardContent, poll } = useClipboard({
  doPolling,
});

const input = ref<HTMLInputElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

const inputPlaceholder = computed(() => {
  if (watchClipboardStore.isActive) {
    return t('layout.header.watchClipboardPlaceholder');
  }
  const defaultPlaceholder = t('layout.header.placeholder');
  if (clipboardHasValidUrl.value) {
    return clipboardContent.value ?? defaultPlaceholder;
  } else {
    return defaultPlaceholder;
  }
});

const clipboardHasValidUrl = computed(() => isValidUrl(clipboardContent));

const url = ref('');

async function addClipboardUrlToQueue(urlToRecord: string) {
  if (!watchClipboardStore.isActive || !isValidUrl(urlToRecord) || watchClipboardStore.hasSeen(urlToRecord)) {
    return;
  }

  watchClipboardStore.markSeen(urlToRecord);
  await mediaStore.addAndDownload(urlToRecord);
}

function addFromInput(immediateDownload: boolean = true) {
  const urlToSubmit = url.value.length > 0 ? url.value : clipboardContent.value;
  if (!urlToSubmit) return;
  void processParsedUrls(parseUrlInputText(urlToSubmit), immediateDownload, true);
  void router.push('/');
  url.value = '';
}

async function processParsedUrls(
  result: { urls: string[]; skipped: number },
  immediateDownload: boolean = true,
  fromInput: boolean = false,
) {
  if (result.urls.length > 0) {
    if (immediateDownload) {
      await mediaStore.addUrlBatchAndDownload(result.urls, false, true);
    } else {
      await mediaStore.addUrlBatch(result.urls);
    }
  }

  if (!fromInput || result.urls.length > 1) {
    const toast = getUrlImportToast(result);
    toastStore.showToast(toast.message, { style: toast.style });
  }
}

const selectedTrackType = computed({
  get: () => preferencesStore.preferences?.formats?.trackType ?? TrackType.both,
  set: (val: TrackType) => {
    if (preferencesStore.preferences?.formats) {
      preferencesStore.preferences.formats.trackType = val;
    }
    void preferencesStore.patch({ formats: { trackType: val } });
    optionsStore.applyGlobalOptions(formatPreferencesToDownloadOptions(preferencesStore.preferences?.formats));
  },
});

const trackTypeLabel = computed(() => {
  return selectedTrackType.value === TrackType.audio
    ? t('media.steps.configure.trackTypes.audio')
    : t('media.steps.configure.trackTypes.video');
});

const trackTypeOptions = computed(() => [
  {
    value: TrackType.both,
    label: t('media.steps.configure.trackTypes.video'),
    icon: FilmIcon,
  },
  {
    value: TrackType.audio,
    label: t('media.steps.configure.trackTypes.audio'),
    icon: MusicalNoteIcon,
  },
]);

function setTrackType(val: TrackType) {
  selectedTrackType.value = val;
  isDropdownOpen.value = false;
}

const closeOnItemClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement | null;
  const item = target?.closest('button, a');
  if (item && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  isDropdownOpen.value = false;
};

function onDocumentClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isDropdownOpen.value = false;
  }
}

const actionType = computed<'download' | 'paste'>(() => {
  return url.value.trim().length > 0 ? 'download' : 'paste';
});

const actionButtonText = computed(() => {
  return actionType.value === 'download' ? t('common.download') : t('common.paste');
});

async function handleActionClick(event: MouseEvent) {
  if (actionType.value === 'paste') {
    let textToUse = clipboardContent.value;
    if (!textToUse) {
      try {
        textToUse = await readText();
      } catch {
        try {
          textToUse = await navigator.clipboard.readText();
        } catch {
          // ignore
        }
      }
    }
    if (textToUse && textToUse.trim().length > 0) {
      const trimmed = textToUse.trim();
      const parsed = parseUrlInputText(trimmed);
      if (parsed.urls.length > 0) {
        url.value = '';
        void processParsedUrls(parsed, !event.shiftKey, true);
        void router.push('/');
      } else {
        url.value = trimmed;
        const toast = getUrlImportToast(parsed);
        toastStore.showToast(toast.message, { style: toast.style });
        input.value?.focus();
      }
    } else {
      input.value?.focus();
    }
  } else {
    addFromInput(!event.shiftKey);
  }
}

function handleSubmit() {
  if (url.value.trim().length > 0) {
    addFromInput(true);
  } else if (clipboardHasValidUrl.value && clipboardContent.value) {
    url.value = clipboardContent.value;
    addFromInput(true);
  }
}

onMounted(() => {
  input.value?.focus();
  document.addEventListener('click', onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
});

watch(clipboardContent, (value) => {
  if (!value) return;
  void addClipboardUrlToQueue(value);
});

watch(() => watchClipboardStore.isActive, (isActive) => {
  if (!isActive) return;
  poll();
  const currentClipboard = clipboardContent.value;
  if (!currentClipboard) return;
  void addClipboardUrlToQueue(currentClipboard);
});

</script>
