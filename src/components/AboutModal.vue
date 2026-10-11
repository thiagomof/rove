<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <dialog ref="dialogRef" class="modal" @close="aboutStore.close">
    <div class="modal-box relative max-w-md p-6 text-center shadow-2xl rounded-2xl border border-base-300 bg-base-100">
      <button
        type="button"
        class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
        aria-label="Close"
        @click="aboutStore.close"
      >
        ✕
      </button>

      <div class="flex flex-col items-center gap-2 mb-4">
        <img src="/icon.png" alt="Logo" class="w-16 h-16 rounded-2xl shadow-md object-contain" />
        <h3 class="text-xl font-bold tracking-tight text-base-content">Rove</h3>
        <span v-if="appVersion" class="badge badge-soft text-xs font-semibold px-2.5 py-1">
          v{{ appVersion }}
        </span>
      </div>

      <p class="text-sm text-base-content/80 mb-3 leading-relaxed">
        {{ t('about.credit') }}
      </p>

      <div class="text-xs text-base-content/60 flex items-center justify-center gap-2 mb-4">
        <span>{{ t('about.poweredBy') }}</span>
        <button type="button" @click="openLicenses" class="link text-[#0075fa] font-medium hover:underline">
          {{ t('about.viewLicenses') }}
        </button>
      </div>

      <div class="flex items-center justify-center gap-4 text-xs font-medium text-base-content/70 border-t border-base-200 pt-4">
        <a href="https://github.com/jely2002/youtube-dl-gui/issues/new?template=bug_report.md" class="link link-hover" target="_blank" rel="noopener">
          {{ t('about.links.reportABug') }}
        </a>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="aboutStore.close">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAboutStore } from '../stores/about';
import { useLicensesStore } from '../stores/licenses';

const { t } = useI18n();
const aboutStore = useAboutStore();
const licensesStore = useLicensesStore();
const appVersion = typeof __APP_VERSION__ === 'undefined' ? '' : __APP_VERSION__;

const dialogRef = ref<HTMLDialogElement | null>(null);

watch(
  () => aboutStore.isOpen,
  (open) => {
    if (open) {
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  },
);

const openLicenses = () => {
  licensesStore.open();
};
</script>
