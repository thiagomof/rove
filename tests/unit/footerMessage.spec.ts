import { describe, it, expect } from 'vitest';
import { useMediaGroupStore } from '../../src/stores/media/group';
import { useMediaStateStore, MediaState } from '../../src/stores/media/state';
import TheFooter from '../../src/components/TheFooter.vue';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';

describe('TheFooter progress message', () => {
  it('does not show footer when items are only queued/ready and not downloading', () => {
    const groupStore = useMediaGroupStore();
    const stateStore = useMediaStateStore();

    groupStore.createGroup({
      id: 'g1',
      url: 'g1',
      total: 2,
      processed: 2,
      errored: 0,
      isCombined: true,
      audioCodecs: [],
      formats: [],
      filesize: 0,
      items: {
        a: { id: 'a', url: 'a', title: 'A', audioCodecs: [], formats: [], filesize: 0, isLeader: true },
        b: { id: 'b', url: 'b', title: 'B', audioCodecs: [], formats: [], filesize: 0 },
      },
    });

    stateStore.setState('a', MediaState.done);
    stateStore.setState('b', MediaState.configure);

    const wrapper = mount(TheFooter, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: 'en',
            fallbackLocale: 'en',
            messages: {
              en: {
                layout: {
                  footer: {
                    progress: {
                      downloading: 'Downloading queue - {done} of {total} completed.',
                    },
                  },
                },
              },
            },
          }),
        ],
        stubs: {
          BaseProgress: { template: '<div><slot /></div>' },
        },
      },
    });

    expect(wrapper.find('footer').exists()).toBe(false);
  });

  it('shows download progress when items are downloading', () => {
    const groupStore = useMediaGroupStore();
    const stateStore = useMediaStateStore();

    groupStore.createGroup({
      id: 'g2',
      url: 'g2',
      total: 2,
      processed: 2,
      errored: 0,
      isCombined: true,
      audioCodecs: [],
      formats: [],
      filesize: 0,
      items: {
        a: { id: 'a', url: 'a', title: 'A', audioCodecs: [], formats: [], filesize: 0, isLeader: true },
        b: { id: 'b', url: 'b', title: 'B', audioCodecs: [], formats: [], filesize: 0 },
      },
    });

    stateStore.setState('a', MediaState.done);
    stateStore.setState('b', MediaState.downloading);

    const wrapper = mount(TheFooter, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: 'en',
            fallbackLocale: 'en',
            messages: {
              en: {
                layout: {
                  footer: {
                    progress: {
                      downloading: 'Downloading queue - {done} of {total} completed.',
                    },
                  },
                },
              },
            },
          }),
        ],
        stubs: {
          BaseProgress: { template: '<div><slot /></div>' },
        },
      },
    });

    expect(wrapper.find('footer').exists()).toBe(true);
    expect(wrapper.text()).toContain('Downloading queue - 0 of 1 completed.');
  });
});
