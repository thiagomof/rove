<template>
  <div class="flex flex-col gap-4">
    <cookies-config v-model="settings.auth" />
    <div class="divider my-0" />
    <credentials-config v-model="strongholdFields" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Settings } from '../../../tauri/types/config.ts';
import CookiesConfig from '../../../components/authentication/CookiesConfig.vue';
import CredentialsConfig from '../../../components/authentication/CredentialsConfig.vue';
import { StrongholdFields, useStrongholdStore } from '../../../stores/stronghold';

const settings = defineModel<Settings>({ required: true });

const strongholdStore = useStrongholdStore();
const strongholdFields = ref<StrongholdFields>({
  username: null,
  password: null,
  videoPassword: null,
  bearer: null,
  headers: null,
});

onMounted(async () => {
  try {
    if (!strongholdStore.status.unlocked) {
      return;
    }
    strongholdFields.value = await strongholdStore.getValues();
  } catch (e) {
    console.error(e);
  }
});

watch(strongholdFields, async (val) => {
  if (strongholdStore.status.unlocked) {
    try {
      await strongholdStore.setValues(val);
    } catch (e) {
      console.error(e);
    }
  }
}, { deep: true });
</script>
