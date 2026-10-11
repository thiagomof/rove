<template>
  <aside class="flex flex-col justify-between items-center h-full relative shrink-0">
    <button
        type="button"
        :title="t('media.card.actions.remove')"
        @click="removeItem"
        class="btn btn-xs btn-circle btn-ghost text-base-content/30 hover:text-base-content/80 hover:bg-base-content/10 transition-colors"
    >
      <span class="sr-only">{{ t('media.card.actions.remove') }}</span>
      <x-mark-icon class="w-4 h-4 stroke-2" />
    </button>

    <div class="my-auto flex flex-col items-center">
      <button
          v-if="canRetry"
          type="button"
          :title="t('media.card.actions.retry')"
          @click="retryItem"
          class="btn btn-sm btn-circle btn-primary shadow-md hover:scale-110 active:scale-95 transition-all"
      >
        <span class="sr-only">{{ t('media.card.actions.retry') }}</span>
        <arrow-path-icon class="w-4 h-4 stroke-2" />
      </button>

      <button
          v-else-if="canPause"
          type="button"
          :title="t('media.card.actions.pause')"
          @click="pauseItem"
          class="btn btn-sm btn-circle btn-warning shadow-md hover:scale-110 active:scale-95 transition-all"
      >
        <span class="sr-only">{{ t('media.card.actions.pause') }}</span>
        <pause-icon class="w-4 h-4 stroke-2" />
      </button>

      <button
          v-else-if="canResume"
          type="button"
          :title="t('media.card.actions.resume')"
          @click="resumeItem"
          class="btn btn-sm btn-circle btn-primary shadow-md hover:scale-110 active:scale-95 transition-all"
      >
        <span class="sr-only">{{ t('media.card.actions.resume') }}</span>
        <play-icon class="w-4 h-4 stroke-2" />
      </button>
    </div>

    <div class="dropdown dropdown-top dropdown-end relative">
      <button
          type="button"
          tabindex="0"
          role="button"
          :title="t('layout.header.actions.more')"
          class="btn btn-xs btn-circle btn-ghost text-base-content/40 hover:text-base-content/80 hover:bg-base-content/10 transition-colors"
      >
        <span class="sr-only">{{ t('layout.header.actions.more') }}</span>
        <ellipsis-vertical-icon class="w-4 h-4" />
      </button>

      <ul
          tabindex="0"
          class="dropdown-content menu z-50 p-1.5 shadow-xl bg-base-100 rounded-box w-56 border border-base-content/10 text-xs gap-0.5"
          @click="closeOnItemClick"
      >
        <li>
          <button
              type="button"
              :disabled="!isValidExternalUrl"
              @click="openExternalUrl"
              class="flex items-center gap-2 py-2"
          >
            <arrow-top-right-on-square-icon class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ t('media.card.actions.externalUrl') }}</span>
          </button>
        </li>

        <li v-if="canPause">
          <button
              type="button"
              @click="pauseItem"
              class="flex items-center gap-2 py-2"
          >
            <pause-icon class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ t('media.card.actions.pause') }}</span>
          </button>
        </li>
        <li v-else-if="canResume">
          <button
              type="button"
              @click="resumeItem"
              class="flex items-center gap-2 py-2"
          >
            <play-icon class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ t('media.card.actions.resume') }}</span>
          </button>
        </li>
        <li v-else-if="canDownload">
          <button
              type="button"
              @click="downloadItem"
              class="flex items-center gap-2 py-2"
          >
            <arrow-down-tray-icon class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ t('media.card.actions.download') }}</span>
          </button>
        </li>
        <li v-else>
          <button
              type="button"
              :disabled="!canRetry"
              @click="retryItem"
              class="flex items-center gap-2 py-2"
          >
            <arrow-path-icon class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ t('media.card.actions.retry') }}</span>
          </button>
        </li>

        <li>
          <router-link
              v-if="canViewInfo"
              :to="{ name: 'group.metadata', params: { groupId: group.id } }"
              class="flex items-center gap-2 py-2"
          >
            <information-circle-icon class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ t('media.card.actions.metadata') }}</span>
          </router-link>
          <button
              v-else
              type="button"
              disabled
              class="flex items-center gap-2 py-2"
          >
            <information-circle-icon class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ t('media.card.actions.metadata') }}</span>
          </button>
        </li>

        <li>
          <router-link
              :to="{ name: 'settings.downloads' }"
              class="flex items-center gap-2 py-2 text-primary font-medium"
          >
            <cog8-tooth-icon class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ t('settings.tabs.downloads') }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>
<script setup lang="ts">
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  Cog8ToothIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { computed, PropType } from 'vue';
import { useOpener } from '../../../composables/useOpener';
import { MediaState, useMediaStateStore } from '../../../stores/media/state';
import { Group } from '../../../tauri/types/group';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { openUrl } = useOpener();

const emit = defineEmits<{
  (e: 'download'): void;
  (e: 'pause'): void;
  (e: 'resume'): void;
  (e: 'remove'): void;
  (e: 'retry'): void;
}>();

const { group } = defineProps({
  group: {
    type: Object as PropType<Group>,
    required: true,
  },
});

const stateStore = useMediaStateStore();
const groupState = computed(() => stateStore.getGroupState(group.id));

const canDownload = computed(() => groupState.value === MediaState.configure);
const canPause = computed(() => groupState.value === MediaState.downloading || groupState.value === MediaState.downloadingList);
const canResume = computed(() => groupState.value === MediaState.paused || groupState.value === MediaState.pausedList);
const canRetry = computed(() => groupState.value === MediaState.done || groupState.value === MediaState.error);
const canViewInfo = computed(() => groupState.value !== MediaState.fetching && groupState.value !== MediaState.playlistSelection);

const isValidExternalUrl = computed(() => {
  // Matches the requirement in 'src-tauri/capabilities/default.json' at 'permissions[4].allow[0].url'.
  const isAllowed = group.url.startsWith('https');
  if (!isAllowed) return false;
  try {
    new URL(group.url);
    return true;
  } catch {
    return false;
  }
});

const downloadItem = (): void => {
  emit('download');
};

const pauseItem = (): void => {
  emit('pause');
};

const resumeItem = (): void => {
  emit('resume');
};

const retryItem = (): void => {
  emit('retry');
};

const removeItem = (): void => {
  emit('remove');
};

const openExternalUrl = (): void => {
  void openUrl(group.url ?? '');
};

function closeOnItemClick(event: Event) {
  const target = event.target as HTMLElement | null;
  const clickable = target?.closest('button, a, [role="menuitem"]') as HTMLElement | null;
  clickable?.blur();

  const dropdown = target?.closest('.dropdown') as HTMLElement | null;
  const menu = dropdown?.querySelector('.dropdown-content[tabindex="0"]') as HTMLElement | null;
  const toggle = dropdown?.querySelector('button[tabindex="0"]') as HTMLElement | null;
  menu?.blur();
  toggle?.blur();

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}
</script>
