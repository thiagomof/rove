import { listen } from '@tauri-apps/api/event';
import { NavigatePayload } from '../types/app.ts';
import router from '../../router.ts';
import { useAboutStore } from '../../stores/about.ts';

export function registerAppListeners() {
  void listen<NavigatePayload>('navigate', (event) => {
    if (event.payload.route === 'about' || event.payload.route === 'settings.about') {
      const aboutStore = useAboutStore();
      aboutStore.open();
      return;
    }
    const route = event.payload.route === 'settings' ? 'settings.downloads' : event.payload.route;
    void router.push({ name: route });
  });

  void listen('open-about', () => {
    const aboutStore = useAboutStore();
    aboutStore.open();
  });
}
