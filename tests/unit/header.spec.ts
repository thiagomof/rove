import { mount, RouterLinkStub } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { defineComponent, reactive, ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TheHeader from '../../src/components/TheHeader.vue';
import { i18n } from '../../src/i18n';
import { createDefaultInputFilterSettings } from '../../src/helpers/inputFilters';

const dispatchMediaInfoFetch = vi.fn();
const addUrlBatch = vi.fn();
const addUrlBatchAndDownload = vi.fn();
const showToast = vi.fn();
const toggleClipboard = vi.fn();
const markSeen = vi.fn();
const poll = vi.fn();
const clipboardContent = ref('');
const watchClipboardState = reactive({
  isActive: false,
});
const settingsState = reactive({
  input: {
    autoFillClipboard: false,
    preferVideoInMixedLinks: false,
  },
  inputFilters: createDefaultInputFilterSettings(),
});

vi.mock('../../src/stores/media/media', () => ({
  useMediaStore: () => ({
    dispatchMediaInfoFetch,
    addUrlBatch,
    addUrlBatchAndDownload,
    deleteAllGroups: vi.fn(),
    deleteGroupsByState: vi.fn(),
    downloadAllGroups: vi.fn(),
    pauseAllGroups: vi.fn(),
    resumeAllGroups: vi.fn(),
  }),
}));

vi.mock('../../src/stores/toast', () => ({
  useToastStore: () => ({
    showToast,
  }),
}));

vi.mock('../../src/stores/watchClipboard', () => ({
  useWatchClipboardStore: () => ({
    get isActive() {
      return watchClipboardState.isActive;
    },
    toggle: toggleClipboard,
    hasSeen: vi.fn(() => false),
    markSeen,
  }),
}));

vi.mock('../../src/stores/settings', () => ({
  useSettingsStore: () => ({
    settings: settingsState,
  }),
}));

vi.mock('../../src/composables/useClipboard', () => ({
  useClipboard: () => ({
    content: clipboardContent,
    poll,
  }),
}));

function createBlankView() {
  return defineComponent({
    template: '<div />',
  });
}

describe('TheHeader', () => {
  beforeEach(() => {
    dispatchMediaInfoFetch.mockReset();
    addUrlBatch.mockReset();
    addUrlBatchAndDownload.mockReset();
    showToast.mockReset();
    toggleClipboard.mockReset();
    markSeen.mockReset();
    poll.mockReset();
    clipboardContent.value = '';
    watchClipboardState.isActive = false;
    settingsState.input.autoFillClipboard = false;
    settingsState.inputFilters = createDefaultInputFilterSettings();
  });

  async function createRouterForHeader() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: createBlankView(),
        },
        {
          path: '/settings',
          name: 'settings.downloads',
          component: createBlankView(),
        },
        {
          path: '/input-filters',
          name: 'input-filters',
          component: createBlankView(),
        },
      ],
    });

    await router.push('/');
    await router.isReady();
    return router;
  }

  it('navigates the settings button to the downloads tab route', async () => {
    const router = await createRouterForHeader();

    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, i18n],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const links = wrapper.findAllComponents(RouterLinkStub).map(link => link.props('to'));
    expect(links).toContainEqual({ name: 'settings.downloads' });
  });

  it('downloads parsed urls immediately from the input field', async () => {
    const router = await createRouterForHeader();
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, i18n],
      },
    });

    await wrapper.get('#queue-url-input').setValue('https://example.com/a https://example.com/b');

    const actionButton = wrapper.get('#queue-action-button');
    expect(actionButton.text()).toContain('Download');
    await actionButton.trigger('click');

    expect(addUrlBatchAndDownload).toHaveBeenCalledWith([
      'https://example.com/a',
      'https://example.com/b',
    ], false, true);
    expect((wrapper.get('#queue-url-input').element as HTMLInputElement).value).toBe('');
  });

  it('queues without downloading when shift-clicking add', async () => {
    const router = await createRouterForHeader();
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, i18n],
      },
    });

    await wrapper.get('#queue-url-input').setValue('https://example.com/a');

    const actionButton = wrapper.get('#queue-action-button');
    await actionButton.trigger('click', { shiftKey: true });

    expect(addUrlBatch).toHaveBeenCalledWith(['https://example.com/a']);
  });

  it('shows Paste when clipboard has a valid url and queues immediately upon clicking Paste', async () => {
    clipboardContent.value = 'https://example.com/from-clipboard';
    const router = await createRouterForHeader();
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, i18n],
      },
    });

    const actionButton = wrapper.get('#queue-action-button');
    expect(actionButton.text()).toContain('Paste');

    await actionButton.trigger('click');
    expect(addUrlBatchAndDownload).toHaveBeenCalledWith([
      'https://example.com/from-clipboard',
    ], false, true);
    expect((wrapper.get('#queue-url-input').element as HTMLInputElement).value).toBe('');
  });

  it('renders track type dropdown button beside download button', async () => {
    const router = await createRouterForHeader();
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, i18n],
      },
    });

    const trackTypeButton = wrapper.find('#queue-track-type-button');
    expect(trackTypeButton.exists()).toBe(true);
  });

  it('uses clipboard content as the placeholder when it contains a valid url', async () => {
    clipboardContent.value = 'https://example.com/from-clipboard';
    const router = await createRouterForHeader();
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, i18n],
      },
    });

    expect((wrapper.get('#queue-url-input').element as HTMLInputElement).placeholder)
      .toBe('https://example.com/from-clipboard');
  });
});
