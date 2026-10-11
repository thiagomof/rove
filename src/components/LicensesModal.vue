<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <dialog ref="dialogRef" class="modal" @close="licensesStore.close">
    <div class="modal-box relative max-w-2xl p-6 shadow-2xl rounded-2xl border border-base-300 bg-base-100 flex flex-col max-h-[85vh]">
      <!-- Close Button -->
      <button
        type="button"
        class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-base-content/70 hover:text-base-content"
        aria-label="Close"
        @click="licensesStore.close"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="flex items-center gap-3.5 mb-4 pr-8">
        <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
          <ScaleIcon class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-base-content leading-tight">
            {{ isPt ? 'Licenças de Código Aberto' : 'Open Source Licenses' }}
          </h3>
          <p class="text-xs text-base-content/60">
            {{ isPt ? 'O Rove é construído graças a projetos incríveis mantidos pela comunidade.' : 'Rove is built on top of amazing open source community projects.' }}
          </p>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs tabs-box bg-base-200/60 p-1 rounded-xl mb-4 self-start">
        <button
          type="button"
          class="tab tab-sm font-medium transition-all"
          :class="{ 'tab-active font-semibold shadow-sm': activeTab === 'overview' }"
          @click="activeTab = 'overview'"
        >
          {{ isPt ? 'Principais Ferramentas' : 'Core Engines & Tools' }}
        </button>
        <button
          type="button"
          class="tab tab-sm font-medium transition-all"
          :class="{ 'tab-active font-semibold shadow-sm': activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          {{ isPt ? 'Texto Completo' : 'Full License Text' }}
        </button>
      </div>

      <!-- Tab 1: Overview of Core Libraries -->
      <div v-if="activeTab === 'overview'" class="flex-1 overflow-y-auto pr-1 space-y-2.5">
        <div
          v-for="tool in coreTools"
          :key="tool.name"
          class="p-3.5 rounded-xl border border-base-200 bg-base-200/30 hover:bg-base-200/60 transition-colors flex items-start justify-between gap-3"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-sm text-base-content">{{ tool.name }}</span>
              <span class="badge badge-sm badge-soft" :class="tool.badgeClass">
                {{ tool.license }}
              </span>
            </div>
            <p class="text-xs text-base-content/70 leading-relaxed">
              {{ isPt ? tool.descriptionPt : tool.descriptionEn }}
            </p>
          </div>
          <a
            v-if="tool.url"
            :href="tool.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost btn-xs text-primary font-medium hover:underline shrink-0 flex items-center gap-1"
          >
            <span>{{ isPt ? 'Projeto' : 'Project' }}</span>
            <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <!-- Tab 2: Full License / Dependencies Notice -->
      <div v-else-if="activeTab === 'all'" class="flex-1 overflow-hidden flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-base-content/70">
            {{ isPt ? 'Termos e declaração de licenças de terceiros:' : 'Third-party notice and license terms:' }}
          </span>
          <button
            type="button"
            class="btn btn-xs btn-outline btn-primary gap-1.5"
            @click="copyLicenseText"
          >
            <template v-if="copied">
              <CheckIcon class="w-3.5 h-3.5 text-success" />
              <span>{{ isPt ? 'Copiado!' : 'Copied!' }}</span>
            </template>
            <template v-else>
              <ClipboardDocumentIcon class="w-3.5 h-3.5" />
              <span>{{ isPt ? 'Copiar' : 'Copy' }}</span>
            </template>
          </button>
        </div>
        <div class="flex-1 bg-base-200/50 rounded-xl p-3 border border-base-300 font-mono text-[11px] leading-relaxed overflow-y-auto select-all text-base-content/80">
          <pre class="whitespace-pre-wrap font-sans">{{ fullLicenseText }}</pre>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-action mt-4 pt-3 border-t border-base-200 flex justify-between items-center">
        <div class="flex items-center gap-1.5 text-[11px] text-base-content/50">
          <ShieldCheckIcon class="w-4 h-4 text-primary/70" />
          <span>{{ isPt ? 'Rove • Software Livre & Código Aberto' : 'Rove • Free & Open Source Software' }}</span>
        </div>
        <button type="button" class="btn btn-sm btn-primary px-5" @click="licensesStore.close">
          {{ isPt ? 'Fechar' : 'Close' }}
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="licensesStore.close">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ScaleIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline';
import { useLicensesStore } from '../stores/licenses';

const { locale } = useI18n();
const licensesStore = useLicensesStore();

const dialogRef = ref<HTMLDialogElement | null>(null);
const activeTab = ref<'overview' | 'all'>('overview');
const copied = ref(false);

const isPt = computed(() => locale.value?.toLowerCase().startsWith('pt'));

watch(
  () => licensesStore.isOpen,
  (open) => {
    if (open) {
      copied.value = false;
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  },
);

const coreTools = [
  {
    name: 'yt-dlp',
    license: 'Unlicense',
    badgeClass: 'badge-success',
    url: 'https://github.com/yt-dlp/yt-dlp',
    descriptionPt: 'Motor principal de extração e download de vídeos e áudios de centenas de plataformas online.',
    descriptionEn: 'Primary command-line audio/video downloader for hundreds of platforms.',
  },
  {
    name: 'FFmpeg & FFprobe',
    license: 'LGPL-2.1+ / GPL',
    badgeClass: 'badge-info',
    url: 'https://ffmpeg.org',
    descriptionPt: 'Mecanismo completo para conversão, decodificação, multiplexação e processamento multimídia.',
    descriptionEn: 'Universal multimedia framework to decode, encode, transcode, and mux audio and video streams.',
  },
  {
    name: 'Tauri',
    license: 'MIT / Apache-2.0',
    badgeClass: 'badge-primary',
    url: 'https://tauri.app',
    descriptionPt: 'Framework de alto desempenho em Rust para criação de binários nativos seguros e leves.',
    descriptionEn: 'High-performance Rust-based framework for building tiny, fast, and secure desktop apps.',
  },
  {
    name: 'Vue.js 3',
    license: 'MIT',
    badgeClass: 'badge-secondary',
    url: 'https://vuejs.org',
    descriptionPt: 'Framework reativo progressivo para a construção da interface de usuário do Rove.',
    descriptionEn: 'Progressive reactive JavaScript framework powering the user interface.',
  },
  {
    name: 'Deno',
    license: 'MIT',
    badgeClass: 'badge-neutral',
    url: 'https://deno.com',
    descriptionPt: 'Runtime moderno e seguro para execução de scripts de suporte e ferramentas auxiliares.',
    descriptionEn: 'Modern, secure JavaScript and TypeScript runtime used for specialized tool operations.',
  },
  {
    name: 'AtomicParsley',
    license: 'GPL-2.0',
    badgeClass: 'badge-warning',
    url: 'https://github.com/wez/atomicparsley',
    descriptionPt: 'Utilitário de linha de comando para embutir tags, capas e metadados em arquivos MP4/M4A.',
    descriptionEn: 'Command-line tool for reading, parsing, and embedding metadata tags in MP4 and M4A files.',
  },
  {
    name: 'Tailwind CSS & DaisyUI',
    license: 'MIT',
    badgeClass: 'badge-ghost',
    url: 'https://tailwindcss.com',
    descriptionPt: 'Sistema de estilização moderno e componentes de design responsivos com temas adaptáveis.',
    descriptionEn: 'Modern utility-first CSS framework and design components supporting dynamic themes.',
  },
];

const fullLicenseText = computed(() => {
  return `Rove – Third-Party Licenses & Credits
=========================================

Rove is an open-source project designed for fast and modern video downloading.
It is distributed under the GNU Affero General Public License (AGPL-3.0-or-later).

This application incorporates and interacts with the following open-source software:

1. yt-dlp (The Unlicense - Public Domain)
   https://github.com/yt-dlp/yt-dlp
   This is free and unencumbered software released into the public domain.

2. FFmpeg & FFprobe (GNU Lesser General Public License / GPL)
   https://ffmpeg.org
   FFmpeg is a trademark of Fabrice Bellard, originator of the FFmpeg project.
   Rove uses dynamic executables of FFmpeg under the terms of the LGPLv2.1 / GPL.

3. Tauri (MIT / Apache 2.0 License)
   https://tauri.app
   Copyright (c) 2019-present Tauri Programme within The Commons Conservancy.

4. Vue 3 & Pinia (MIT License)
   https://vuejs.org
   Copyright (c) 2018-present Evan You and Vue.js contributors.

5. AtomicParsley (GNU General Public License v2)
   https://github.com/wez/atomicparsley
   Copyright (c) 2005-2007 puck_dropper & contributors.

6. Deno (MIT License)
   https://deno.land
   Copyright (c) 2018-present the Deno authors.

-------------------------------------------------------------
All NPM and Rust libraries used to build this software are subject
to their respective licenses (MIT, Apache-2.0, BSD, ISC, MPL, etc.).
Full license headers and terms are preserved in the build artifacts.
`;
});

const copyLicenseText = async () => {
  try {
    await navigator.clipboard.writeText(fullLicenseText.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch (err) {
    console.error('Failed to copy license text:', err);
  }
};
</script>
