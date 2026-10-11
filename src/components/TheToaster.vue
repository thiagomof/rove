<template>
  <div class="toast toast-top toast-end fixed z-50">
    <TransitionGroup name="toast-fade" tag="div">
      <div
          v-for="toast in toasts"
          :key="toast.id"
          class="alert cursor-pointer mb-2 flex items-center gap-2 shadow-lg"
          :class="styleClass(toast.style)"
          @click="removeToast(toast.id)"
      >
        <svg
            v-if="toast.style === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
            v-else-if="toast.style === 'warning'"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="font-medium text-sm">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ToastStyle, useToastStore } from '../stores/toast';

const { toasts, removeToast } = useToastStore();

const styleClass = (style: ToastStyle) => {
  return {
    'alert-error': style === 'error',
    'alert-warning': style === 'warning',
    'toast-blue': style !== 'error' && style !== 'warning',
  };
};
</script>

<style scoped>
.toast-blue {
  background-color: #0075fa !important;
  color: #ffffff !important;
  border-color: #0075fa !important;
  box-shadow: 0 4px 14px 0 rgba(0, 117, 250, 0.35) !important;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s ease-out;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
