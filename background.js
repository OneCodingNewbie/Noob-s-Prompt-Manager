const EXTENSION_ID = chrome.runtime.id;

const CTX_TITLES = {
  en: 'Save to Prompt Manager',
  'zh-CN': '保存到提示词管理器',
  'zh-TW': '儲存到提示詞管理器'
};

const CTX_APPEND_TITLES = {
  en: 'Add to Saved Prompt',
  'zh-CN': '追加到已有提示词',
  'zh-TW': '附加到現有提示詞'
};

const CTX_LAST_ENTRY_TITLES = {
  en: 'Save to Last Entry',
  'zh-CN': '保存到最后一条',
  'zh-TW': '儲存到最後一則'
};

function createContextMenus(lang) {
  chrome.contextMenus.create({
    id: 'saveToPromptManager',
    title: CTX_TITLES[lang] || CTX_TITLES.en,
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    id: 'appendToPromptManager',
    title: CTX_APPEND_TITLES[lang] || CTX_APPEND_TITLES.en,
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    id: 'saveToLastEntry',
    title: CTX_LAST_ENTRY_TITLES[lang] || CTX_LAST_ENTRY_TITLES.en,
    contexts: ['selection']
  });
}

function refreshContextMenu() {
  chrome.storage.local.get(['settings'], (result) => {
    const lang = (result.settings && result.settings.language) || 'en';
    chrome.contextMenus.removeAll(() => {
      void chrome.runtime.lastError;
      createContextMenus(lang);
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  refreshContextMenu();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.settings) {
    refreshContextMenu();
  }
});

function handleSaveRequest(info, tab, mode) {
  const selectedText = (info.selectionText || '').slice(0, 100000);
  const pageTitle = (tab && tab.title ? tab.title : '').slice(0, 1000);
  const pageUrl = (tab && tab.url ? tab.url : '').slice(0, 2000);

  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || {
      includePageUrl: false,
      includePageTitle: false
    };

    const promptData = {
      text: selectedText,
      pageTitle: settings.includePageTitle ? pageTitle : '',
      pageUrl: settings.includePageUrl ? pageUrl : '',
      mode: mode,
      timestamp: Date.now()
    };

    chrome.storage.local.set({ pendingPrompt: promptData }, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to store pending prompt:', chrome.runtime.lastError);
        return;
      }
      chrome.action.openPopup();
    });
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToPromptManager') {
    handleSaveRequest(info, tab, 'create');
  } else if (info.menuItemId === 'appendToPromptManager') {
    handleSaveRequest(info, tab, 'append');
  } else if (info.menuItemId === 'saveToLastEntry') {
    handleSaveRequest(info, tab, 'appendToLast');
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.id !== EXTENSION_ID) {
    sendResponse({ error: 'unauthorized' });
    return false;
  }

  if (request.action === 'getPendingPrompt') {
    chrome.storage.local.get(['pendingPrompt'], (result) => {
      sendResponse({ pendingPrompt: result.pendingPrompt || null });
    });
    return true;
  }

  if (request.action === 'clearPendingPrompt') {
    chrome.storage.local.remove(['pendingPrompt'], () => {
      sendResponse({ success: true });
    });
    return true;
  }

  return false;
});
