<template>
  <div class="w-full flex flex-col">
    <div v-if="$slots.default || $slots.label || label || percentage != null" class="flex justify-between items-center text-xs font-medium text-base-content/80 mb-1">
      <label :for="composedId" class="truncate" :class="labelClass">
        <slot name="label">{{ label }}</slot>
        <slot v-if="!$slots.label && !label" />
      </label>
      <span v-if="percentage != null" class="tabular-nums font-semibold ml-2 shrink-0" :class="labelClass">
        {{ t('common.percentage', { percent: percentage }) }}
      </span>
      <slot name="right" />
    </div>
    <progress
        :id="composedId"
        class="progress w-full h-1.5 rounded-full block [&::-webkit-progress-value]:transition-all [&::-moz-progress-bar]:transition-all"
        :class="progressClass"
        :max="max"
        :value="value"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type ProgressVariant = 'primary' | 'warning' | 'error';

const PROGRESS_VARIANT_CLASS: Record<ProgressVariant, string> = {
  primary: 'progress-primary',
  warning: 'progress-warning',
  error: 'progress-error',
};

const LABEL_VARIANT_CLASS: Partial<Record<ProgressVariant, string>> = {
  warning: 'text-warning',
  error: 'text-error',
};

const composedId = computed(() => `${id}-progress`);

const { id, max, value, variant, label, percentage } = defineProps({
  id: {
    type: String,
    required: true,
  },
  max: {
    type: Number,
  },
  value: {
    type: Number,
  },
  variant: {
    type: String as PropType<ProgressVariant>,
    default: 'primary',
  },
  label: {
    type: String,
  },
  percentage: {
    type: [Number, String] as PropType<number | string>,
  },
});

const progressClass = computed(() => PROGRESS_VARIANT_CLASS[variant]);
const labelClass = computed(() => LABEL_VARIANT_CLASS[variant] ?? '');

</script>
