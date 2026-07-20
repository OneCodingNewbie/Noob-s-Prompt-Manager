let prompts = [];
let groups = ['General'];
let labels = [];
let currentGroup = 'General';
let currentLabel = 'all';
let editingPromptId = null;
let editingGroupId = null;
let selectedPromptLabels = [];
let pendingAppendText = null;
let selectedAppendId = null;
let expandedPromptIds = new Set();
let settings = {
  enableSearch: true,
  showLabels: true,
  defaultToLastGroup: false,
  showContextMenu: true,
  autoFillTitle: true,
  includePageUrl: false,
  includePageTitle: false,
  highlightColor: '#4a90d9',
  clickToCopy: true,
  warnOnSuspiciousContent: true,
  warnOnCopyPaste: true,
  language: 'en'
};

const MAX_PROMPT_COUNT = 50000;
const MAX_TEXT_LENGTH = 100000;
const MAX_STRING_LENGTH = 1000;
const COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
const ID_REGEX = /^[A-Za-z0-9_-]{1,64}$/;
const VALID_THEMES = ['system', 'light', 'dark'];
const VALID_LANGUAGES = ['en', 'zh-CN', 'zh-TW'];
const APPEND_DIVIDER = '\n\n──────────\n\n';

const TRANSLATIONS = {
  en: {
    appTitle: 'Noob\'s Prompt Manager',
    selectGroup: 'Select Group:',
    searchPlaceholder: 'Search prompts...',
    allLabels: 'All Labels',
    emptyState: 'No prompts yet. Add your first prompt or right-click on selected text to save.',
    addNewPrompt: '+ Add New Prompt',
    createNewGroupBtn: '+ Create New Group',
    totalCount: 'Total: {count} prompt{plural}',
    modalCreatePrompt: 'Create New Prompt',
    modalEditPrompt: 'Edit Prompt',
    modalManageGroups: 'Manage Groups',
    modalManageLabels: 'Manage Labels',
    segmentViewTitle: 'View Segment',
    modalCreateGroup: 'Create New Group',
    modalSettings: 'Settings',
    labelTitle: 'Title:',
    labelPromptText: 'Prompt Text:',
    labelLabels: 'Labels:',
    labelAddLabel: 'Add label',
    labelGroup: 'Group:',
    labelGroupName: 'Group Name:',
    labelDescription: 'Description:',
    placeholderPromptTitle: 'Enter prompt title',
    placeholderPromptText: 'Enter your prompt here...',
    placeholderGroupName: 'Enter group name',
    placeholderGroupDescription: 'Enter group description (optional)',
    btnSavePrompt: 'Save Prompt',
    btnCancel: 'Cancel',
    btnCreateGroup: 'Create Group',
    btnClose: 'Close',
    btnSaveSettings: 'Save Settings',
    btnExport: 'Export All Prompts',
    btnImport: 'Import Prompts',
    btnClearData: 'Clear All Data',
    btnEdit: 'Edit',
    btnCopy: 'Copy',
    btnDelete: 'Delete',
    btnRename: 'Rename',
    btnView: 'View',
    settingsGeneral: 'General Settings',
    settingsHighlight: 'Search Highlight Settings',
    settingsRightClick: 'Right-Click Save Settings',
    settingsSecurity: 'Security Settings',
    settingsData: 'Data Management',
    settingsTheme: 'Theme:',
    settingsLanguage: 'Language:',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    settingsEnableSearch: 'Enable search in prompts',
    settingsShowLabels: 'Show prompt labels',
    settingsDefaultToLastGroup: 'Default to last selected group',
    settingsClickToCopy: 'Click prompt to copy (click to paste)',
    settingsHighlightColor: 'Highlight Color:',
    settingsShowContextMenu: 'Show "Save to Prompt Manager" in menu',
    settingsAutoFillTitle: 'Auto-fill title from selected text',
    settingsIncludePageUrl: 'Use page URL as prompt title',
    settingsIncludePageTitle: 'Use page title as prompt title',
    settingsWarnOnSave: 'Warn about HTML tags/scripts before saving (XSS protection)',
    settingsWarnOnCopyPaste: 'Warn about HTML tags/scripts before copy/paste (XSS protection)',
    notifFillFields: 'Please fill in title and prompt text',
    notifMaxPrompts: 'Maximum number of prompts reached',
    notifPromptSaved: 'Prompt saved successfully!',
    notifPromptUpdated: 'Prompt updated successfully!',
    notifPromptDeleted: 'Prompt deleted successfully!',
    notifPromptCopied: 'Prompt copied to clipboard!',
    notifCopyFailed: 'Failed to copy prompt',
    notifPasted: 'Prompt pasted successfully!',
    notifGroupNameRequired: 'Please enter a group name',
    notifGroupNameTooLong: 'Group name is too long',
    notifGroupExists: 'Group already exists',
    notifGroupCreated: 'Group created successfully!',
    notifGroupRenamed: 'Group renamed successfully!',
    notifGroupDeleted: 'Group deleted successfully!',
    notifDataCleared: 'All data cleared successfully!',
    notifLabelAdded: 'Label added successfully!',
    notifLabelDeleted: 'Label deleted successfully!',
    notifExportOK: 'Prompts exported successfully!',
    notifSettingsSaved: 'Settings saved successfully!',
    notifImportOK: 'Prompts imported successfully!',
    notifImportError: 'Error importing file',
    notifFileTooLarge: 'File is too large (max 10MB)',
    notifInvalidJSON: 'Invalid JSON file',
    notifInvalidFormat: 'Invalid file format',
    notifImportMaxReached: 'Import limited to {count} prompts (max reached)',
    notifImportCancelled: 'Import cancelled',
    notifReadError: 'Error reading file',
    notifCopiedToClipboard: 'Copied to clipboard. Press Ctrl+V to paste.',
    notifClipboardFailed: 'Failed to copy to clipboard',
    notifNoText: 'No text provided',
    notifNoInputField: 'No active input field found',
    confirmDeletePrompt: 'Are you sure you want to delete this prompt?',
    confirmDeleteGroup: 'Are you sure you want to delete the group "{name}"? All prompts in this group will also be deleted.',
    confirmDeleteLabel: 'Are you sure you want to delete the label "{name}"? It will be removed from {count} prompt{plural}.',
    confirmClearAll: 'Are you sure you want to clear all data? This action cannot be undone.',
    notifSegmentDeleted: 'Segment deleted.',
    confirmDeleteLastSegment: 'This is the only segment. Delete the entire prompt?',
    confirmDeleteSegment: 'Delete this segment?',
    expandPrompt: 'Show all segments',
    collapsePrompt: 'Hide segments',
    promptLabelName: 'Enter label name:',
    promptGroupName: 'Enter new group name:',
    defaultGroup: 'General',
    defaultTag: 'Default',
    labelSuggestionsTitle: 'Click to add:',
    labelSuggestionsFilter: 'Matching labels:',
    labelUsageCount: '{count} prompt{plural}',
    noLabelsYet: 'No labels have been created yet.',
    secWarningTitle: '\u26A0 Security Warning',
    secWarningIntroSave: 'You are about to save content that contains HTML tags or code patterns that could be used for Cross-Site Scripting (XSS) if shared, pasted, or rendered elsewhere:',
    secWarningIntroCopy: 'You are about to copy or paste content that contains HTML tags or code patterns that could be used for Cross-Site Scripting (XSS) if shared, pasted, or rendered elsewhere:',
    secWarningIntroImport: 'The file you are importing contains HTML tags or code patterns that could be used for Cross-Site Scripting (XSS):',
    secWarningOutro: 'This extension safely escapes content when displaying it here, but it may not be safe outside of this extension. Do you want to continue anyway? (You can disable this warning in Settings.)',
    btnContinueAnyway: 'Continue Anyway',
    titleClickToCopy: 'Click to copy prompt',
    ctxMenuTitle: 'Save to Prompt Manager',
    modalAppendPrompt: 'Add to Existing Prompt',
    appendSelectHint: 'Select a prompt to append the new text to:',
    appendPreviewLabel: 'Result preview (plain text):',
    appendEmptyHint: 'No prompts available. Create a prompt first.',
    appendPreviewEmpty: '(Select a prompt above to see the combined result)',
    btnAppend: 'Append',
    notifAppended: 'Text appended to prompt!',
    notifAppendedToLast: 'Text appended to "{title}".',
    prompts: 'prompts',
    settingsAuthor: 'Author'
  },
  'zh-CN': {
    appTitle: 'Noob\'s 提示词管理器',
    selectGroup: '选择分组：',
    searchPlaceholder: '搜索提示词……',
    allLabels: '全部标签',
    emptyState: '暂无提示词。请添加您的第一条提示词，或右键单击选中的文本保存。',
    addNewPrompt: '+ 添加新提示词',
    createNewGroupBtn: '+ 创建新分组',
    totalCount: '共 {count} 条提示词',
    modalCreatePrompt: '新建提示词',
    modalEditPrompt: '编辑提示词',
    modalManageGroups: '管理分组',
    modalManageLabels: '管理标签',
    segmentViewTitle: '查看片段',
    modalCreateGroup: '新建分组',
    modalSettings: '设置',
    labelTitle: '标题：',
    labelPromptText: '提示词文本：',
    labelLabels: '标签：',
    labelAddLabel: '添加标签',
    labelGroup: '分组：',
    labelGroupName: '分组名称：',
    labelDescription: '描述：',
    placeholderPromptTitle: '请输入提示词标题',
    placeholderPromptText: '请在此输入提示词……',
    placeholderGroupName: '请输入分组名称',
    placeholderGroupDescription: '请输入分组描述（可选）',
    btnSavePrompt: '保存提示词',
    btnCancel: '取消',
    btnCreateGroup: '创建分组',
    btnClose: '关闭',
    btnSaveSettings: '保存设置',
    btnExport: '导出全部提示词',
    btnImport: '导入提示词',
    btnClearData: '清除全部数据',
    btnEdit: '编辑',
    btnCopy: '复制',
    btnDelete: '删除',
    btnRename: '重命名',
    btnView: '查看',
    settingsGeneral: '通用设置',
    settingsHighlight: '搜索高亮设置',
    settingsRightClick: '右键保存设置',
    settingsSecurity: '安全设置',
    settingsData: '数据管理',
    settingsTheme: '主题：',
    settingsLanguage: '语言：',
    themeSystem: '跟随系统',
    themeLight: '浅色',
    themeDark: '深色',
    settingsEnableSearch: '启用搜索提示词',
    settingsShowLabels: '显示提示词标签',
    settingsDefaultToLastGroup: '默认选择上次分组',
    settingsClickToCopy: '点击提示词复制（点击即粘贴）',
    settingsHighlightColor: '高亮颜色：',
    settingsShowContextMenu: '在右键菜单显示"保存到提示词管理器"',
    settingsAutoFillTitle: '自动从选中文本填充标题',
    settingsIncludePageUrl: '使用页面 URL 作为提示词标题',
    settingsIncludePageTitle: '使用页面标题作为提示词标题',
    settingsWarnOnSave: '保存前警告 HTML 标签/脚本（XSS 防护）',
    settingsWarnOnCopyPaste: '复制/粘贴前警告 HTML 标签/脚本（XSS 防护）',
    notifFillFields: '请填写标题和提示词文本',
    notifMaxPrompts: '已达到提示词数量上限',
    notifPromptSaved: '提示词保存成功！',
    notifPromptUpdated: '提示词更新成功！',
    notifPromptDeleted: '提示词已删除！',
    notifPromptCopied: '提示词已复制到剪贴板！',
    notifCopyFailed: '复制提示词失败',
    notifPasted: '提示词粘贴成功！',
    notifGroupNameRequired: '请输入分组名称',
    notifGroupNameTooLong: '分组名称过长',
    notifGroupExists: '分组已存在',
    notifGroupCreated: '分组创建成功！',
    notifGroupRenamed: '分组重命名成功！',
    notifGroupDeleted: '分组已删除！',
    notifDataCleared: '全部数据已清除！',
    notifLabelAdded: '标签添加成功！',
    notifLabelDeleted: '标签已删除！',
    notifExportOK: '提示词导出成功！',
    notifSettingsSaved: '设置保存成功！',
    notifImportOK: '提示词导入成功！',
    notifImportError: '导入文件出错',
    notifFileTooLarge: '文件过大（最大 10MB）',
    notifInvalidJSON: '无效的 JSON 文件',
    notifInvalidFormat: '无效的文件格式',
    notifImportMaxReached: '导入限制为 {count} 条提示词（已达上限）',
    notifImportCancelled: '已取消导入',
    notifReadError: '读取文件出错',
    notifCopiedToClipboard: '已复制到剪贴板。请按 Ctrl+V 粘贴。',
    notifClipboardFailed: '复制到剪贴板失败',
    notifNoText: '未提供文本',
    notifNoInputField: '未找到可输入框',
    confirmDeletePrompt: '确定要删除此提示词吗？',
    confirmDeleteGroup: '确定要删除分组"{name}"吗？此分组中的全部提示词也将被删除。',
    confirmDeleteLabel: '确定要删除标签"{name}"吗？它将从 {count} 条提示词中移除。',
    confirmClearAll: '确定要清除全部数据吗？此操作无法撤销。',
    notifSegmentDeleted: '片段已删除。',
    confirmDeleteLastSegment: '这是唯一的片段。确定删除整个提示词？',
    confirmDeleteSegment: '删除此片段？',
    expandPrompt: '显示全部片段',
    collapsePrompt: '隐藏片段',
    promptLabelName: '输入标签名：',
    promptGroupName: '输入新分组名称：',
    defaultGroup: 'General',
    defaultTag: '默认',
    labelSuggestionsTitle: '点击添加：',
    labelSuggestionsFilter: '匹配的标签：',
    labelUsageCount: '{count} 条提示词',
    noLabelsYet: '尚未创建任何标签。',
    secWarningTitle: '\u26A0 安全警告',
    secWarningIntroSave: '您即将保存的内容包含 HTML 标签或代码特征，如果分享、粘贴或渲染到其他地方，可能被用于跨站脚本（XSS）攻击：',
    secWarningIntroCopy: '您即将复制或粘贴的内容包含 HTML 标签或代码特征，如果分享、粘贴或渲染到其他地方，可能被用于跨站脚本（XSS）攻击：',
    secWarningIntroImport: '您导入的文件包含 HTML 标签或代码特征，可能被用于跨站脚本（XSS）攻击：',
    secWarningOutro: '此扩展在此处安全地转义了显示内容，但在扩展之外可能不安全。是否仍要继续？（您可以在设置中关闭此警告。）',
    btnContinueAnyway: '仍然继续',
    titleClickToCopy: '点击复制提示词',
    ctxMenuTitle: '保存到提示词管理器',
    modalAppendPrompt: '追加到现有提示词',
    appendSelectHint: '选择要追加新文本的提示词：',
    appendPreviewLabel: '合并结果预览（纯文本）：',
    appendEmptyHint: '暂无可用提示词，请先创建。',
    appendPreviewEmpty: '（请在上方选择一条提示词以查看合并结果）',
    btnAppend: '追加',
    notifAppended: '文本已追加到提示词！',
    notifAppendedToLast: '文本已追加到"{title}"。',
    prompts: '条提示词',
    settingsAuthor: '作者'
  },
  'zh-TW': {
    appTitle: 'Noob\'s 提示詞管理器',
    selectGroup: '選擇分組：',
    searchPlaceholder: '搜尋提示詞……',
    allLabels: '全部標籤',
    emptyState: '暫無提示詞。請新增您的第一條提示詞，或右鍵按一下選取的文字儲存。',
    addNewPrompt: '+ 新增提示詞',
    createNewGroupBtn: '+ 建立新分組',
    totalCount: '共 {count} 則提示詞',
    modalCreatePrompt: '新建提示詞',
    modalEditPrompt: '編輯提示詞',
    modalManageGroups: '管理分組',
    modalManageLabels: '管理標籤',
    segmentViewTitle: '檢視片段',
    modalCreateGroup: '新建分組',
    modalSettings: '設定',
    labelTitle: '標題：',
    labelPromptText: '提示詞文字：',
    labelLabels: '標籤：',
    labelAddLabel: '新增標籤',
    labelGroup: '分組：',
    labelGroupName: '分組名稱：',
    labelDescription: '描述：',
    placeholderPromptTitle: '請輸入提示詞標題',
    placeholderPromptText: '請在此輸入提示詞……',
    placeholderGroupName: '請輸入分組名稱',
    placeholderGroupDescription: '請輸入分組描述（可選）',
    btnSavePrompt: '儲存提示詞',
    btnCancel: '取消',
    btnCreateGroup: '建立分組',
    btnClose: '關閉',
    btnSaveSettings: '儲存設定',
    btnExport: '匯出全部提示詞',
    btnImport: '匯入提示詞',
    btnClearData: '清除全部資料',
    btnEdit: '編輯',
    btnCopy: '複製',
    btnDelete: '刪除',
    btnRename: '重新命名',
    btnView: '檢視',
    settingsGeneral: '一般設定',
    settingsHighlight: '搜尋醒目提示設定',
    settingsRightClick: '右鍵儲存設定',
    settingsSecurity: '安全性設定',
    settingsData: '資料管理',
    settingsTheme: '主題：',
    settingsLanguage: '語言：',
    themeSystem: '跟隨系統',
    themeLight: '淺色',
    themeDark: '深色',
    settingsEnableSearch: '啟用搜尋提示詞',
    settingsShowLabels: '顯示提示詞標籤',
    settingsDefaultToLastGroup: '預設選擇上次分組',
    settingsClickToCopy: '按一下提示詞複製（即貼上）',
    settingsHighlightColor: '醒目提示色彩：',
    settingsShowContextMenu: '在右鍵選單顯示「儲存到提示詞管理器」',
    settingsAutoFillTitle: '自動從選取文字填入標題',
    settingsIncludePageUrl: '使用頁面 URL 作為提示詞標題',
    settingsIncludePageTitle: '使用頁面標題作為提示詞標題',
    settingsWarnOnSave: '儲存前警告 HTML 標籤/指令碼（XSS 防護）',
    settingsWarnOnCopyPaste: '複製/貼上前警告 HTML 標籤/指令碼（XSS 防護）',
    notifFillFields: '請填入標題和提示詞文字',
    notifMaxPrompts: '已達到提示詞數量上限',
    notifPromptSaved: '提示詞儲存成功！',
    notifPromptUpdated: '提示詞更新成功！',
    notifPromptDeleted: '提示詞已刪除！',
    notifPromptCopied: '提示詞已複製到剪貼簿！',
    notifCopyFailed: '複製提示詞失敗',
    notifPasted: '提示詞貼上成功！',
    notifGroupNameRequired: '請輸入分組名稱',
    notifGroupNameTooLong: '分組名稱過長',
    notifGroupExists: '分組已存在',
    notifGroupCreated: '分組建立成功！',
    notifGroupRenamed: '分組重新命名成功！',
    notifGroupDeleted: '分組已刪除！',
    notifDataCleared: '全部資料已清除！',
    notifLabelAdded: '標籤新增成功！',
    notifLabelDeleted: '標籤已刪除！',
    notifExportOK: '提示詞匯出成功！',
    notifSettingsSaved: '設定儲存成功！',
    notifImportOK: '提示詞匯入成功！',
    notifImportError: '匯入檔案出錯',
    notifFileTooLarge: '檔案過大（最大 10MB）',
    notifInvalidJSON: '無效的 JSON 檔案',
    notifInvalidFormat: '無效的檔案格式',
    notifImportMaxReached: '匯入限制為 {count} 則提示詞（已達上限）',
    notifImportCancelled: '已取消匯入',
    notifReadError: '讀取檔案出錯',
    notifCopiedToClipboard: '已複製到剪貼簿。請按 Ctrl+V 貼上。',
    notifClipboardFailed: '複製到剪貼簿失敗',
    notifNoText: '未提供文字',
    notifNoInputField: '未找到可輸入方塊',
    confirmDeletePrompt: '確定要刪除此提示詞嗎？',
    confirmDeleteGroup: '確定要刪除分組「{name}」嗎？此分組中的全部提示詞也將被刪除。',
    confirmDeleteLabel: '確定要刪除標籤「{name}」嗎？它將從 {count} 則提示詞中移除。',
    confirmClearAll: '確定要清除全部資料嗎？此操作無法復原。',
    notifSegmentDeleted: '片段已刪除。',
    confirmDeleteLastSegment: '這是唯一的片段。確定刪除整個提示詞？',
    confirmDeleteSegment: '刪除此片段？',
    expandPrompt: '顯示全部片段',
    collapsePrompt: '隱藏片段',
    promptLabelName: '輸入標籤名稱：',
    promptGroupName: '輸入新分組名稱：',
    defaultGroup: 'General',
    defaultTag: '預設',
    labelSuggestionsTitle: '點擊新增：',
    labelSuggestionsFilter: '符合的標籤：',
    labelUsageCount: '{count} 則提示詞',
    noLabelsYet: '尚未建立任何標籤。',
    secWarningTitle: '\u26A0 安全警告',
    secWarningIntroSave: '您即將儲存的內容包含 HTML 標籤或程式碼特徵，若分享、貼上或於其他地方顯示，可能被用於跨網站指令碼（XSS）攻擊：',
    secWarningIntroCopy: '您即將複製或貼上的內容包含 HTML 標籤或程式碼特徵，若分享、貼上或於其他地方顯示，可能被用於跨網站指令碼（XSS）攻擊：',
    secWarningIntroImport: '您匯入的檔案包含 HTML 標籤或程式碼特徵，可能被用於跨網站指令碼（XSS）攻擊：',
    secWarningOutro: '此擴充功能於此處安全地轉義了顯示內容，但在擴充功能之外可能不安全。是否仍要繼續？（您可以在設定中關閉此警告。）',
    btnContinueAnyway: '仍然繼續',
    titleClickToCopy: '按一下複製提示詞',
    ctxMenuTitle: '儲存到提示詞管理器',
    modalAppendPrompt: '附加到現有提示詞',
    appendSelectHint: '選擇要附加新文字的提示詞：',
    appendPreviewLabel: '合併結果預覽（純文字）：',
    appendEmptyHint: '暫無可用提示詞，請先建立。',
    appendPreviewEmpty: '（請在上方選擇一則提示詞以檢視合併結果）',
    btnAppend: '附加',
    notifAppended: '文字已附加到提示詞！',
    notifAppendedToLast: '文字已附加到「{title}」。',
    prompts: '則提示詞',
    settingsAuthor: '作者'
  }
};

let currentLanguage = 'en';

function t(key, params) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  let text = dict[key] !== undefined ? dict[key] : (TRANSLATIONS['en'][key] || key);
  if (params) {
    Object.keys(params).forEach(k => {
      text = text.replace(`{${k}}`, params[k]);
    });
  }
  return text;
}

function localizePage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    if (attr === 'placeholder') {
      el.placeholder = t(key);
    } else if (attr === 'title') {
      el.title = t(key);
    } else {
      el.textContent = t(key);
    }
  });
}

let currentTheme = 'system';
let systemThemeQuery = null;

document.addEventListener('DOMContentLoaded', () => {
  localizePage();
  initializeExtension();
  setupEventListeners();
  setupDelegatedEventListeners();
  setupSecurityWarningModal();
  initTheme();
});

function setLanguage(lang) {
  if (!VALID_LANGUAGES.includes(lang)) return;
  currentLanguage = lang;
  settings.language = lang;
  document.documentElement.lang = lang;
  localizePage();
  renderPrompts();
  renderGroupsList();
  renderLabelsList();
  updatePromptCount();
  updateGroupDropdowns();
  updateLabelFilter();
  chrome.storage.local.set({ settings });
  document.getElementById('languageSelect').value = lang;
}

function initTheme() {
  chrome.storage.local.get(['theme'], (result) => {
    const stored = result.theme;
    currentTheme = VALID_THEMES.includes(stored) ? stored : 'system';
    applyTheme();
    document.getElementById('themeSelect').value = currentTheme;

    systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeQuery.addEventListener('change', handleSystemThemeChange);
  });
}

function handleSystemThemeChange() {
  if (currentTheme === 'system') {
    applyTheme();
  }
}

function applyTheme() {
  const effective = currentTheme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : currentTheme;
  document.documentElement.setAttribute('data-theme', effective);
}

function setTheme(theme) {
  if (!VALID_THEMES.includes(theme)) return;
  currentTheme = theme;
  applyTheme();
  chrome.storage.local.set({ theme });
  document.getElementById('themeSelect').value = theme;
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(isDark ? 'light' : 'dark');
}

function initializeExtension() {
  chrome.storage.local.get(['prompts', 'groups', 'labels', 'currentGroup', 'settings'], (result) => {
    if (Array.isArray(result.prompts)) prompts = result.prompts;
    if (Array.isArray(result.groups)) groups = result.groups.map(sanitizeString).filter(Boolean);
    if (Array.isArray(result.labels)) labels = result.labels.map(sanitizeString).filter(Boolean);
    if (typeof result.currentGroup === 'string') currentGroup = sanitizeString(result.currentGroup) || 'General';
    if (result.settings && typeof result.settings === 'object') {
      settings = { ...settings, ...sanitizeSettings(result.settings) };
    }

    // Migrate old flat-text prompts to the new segments[] schema
    let migrated = false;
    prompts.forEach(p => {
      if (typeof p.text === 'string' && (!Array.isArray(p.segments) || p.segments.length === 0)) {
        p.segments = [{ id: generateId(), text: p.text, createdAt: p.createdAt || p.updatedAt || Date.now() }];
        delete p.text;
        migrated = true;
      }
    });
    prompts = prompts.filter(isValidPrompt);
    if (migrated) savePrompts();

    currentLanguage = VALID_LANGUAGES.includes(settings.language) ? settings.language : 'en';
    settings.language = currentLanguage;
    document.documentElement.lang = currentLanguage;
    localizePage();
    document.getElementById('languageSelect').value = currentLanguage;

    if (!groups.includes('General')) groups.unshift('General');
    if (!groups.includes(currentGroup)) currentGroup = 'General';

    updateGroupDropdowns();
    updateLabelFilter();
    renderPrompts();
    updatePromptCount();
    checkPendingPrompt();
  });
}

function setupEventListeners() {
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
  document.getElementById('themeSelect').addEventListener('change', (e) => setTheme(e.target.value));
  document.getElementById('languageSelect').addEventListener('change', (e) => setLanguage(e.target.value));

  document.getElementById('groupSelect').addEventListener('change', (e) => {
    currentGroup = e.target.value;
    saveCurrentGroup();
    renderPrompts();
  });

  document.getElementById('labelFilter').addEventListener('change', (e) => {
    currentLabel = e.target.value;
    renderPrompts();
  });

  document.getElementById('searchInput').addEventListener('input', () => {
    renderPrompts();
  });

  document.getElementById('clearSearch').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    renderPrompts();
  });

  document.getElementById('addPromptBtn').addEventListener('click', () => {
    openPromptModal();
  });

  document.getElementById('settingsBtn').addEventListener('click', () => {
    openSettingsModal();
  });

  document.getElementById('editGroupBtn').addEventListener('click', () => {
    openGroupModal();
  });

  document.getElementById('editLabelBtn').addEventListener('click', () => {
    openLabelModal();
  });

  document.getElementById('createGroupBtn').addEventListener('click', () => {
    openCreateGroupModal();
  });

  document.getElementById('addLabelBtn').addEventListener('click', async () => {
    const labelName = prompt(t('promptLabelName'));
    if (labelName && labelName.trim()) {
      const sanitized = sanitizeString(labelName.trim());
      if (!(await confirmSuspiciousContent(sanitized))) return;
      addLabel(sanitized);
    }
  });

  document.getElementById('closePromptModal').addEventListener('click', closePromptModal);
  document.getElementById('cancelPrompt').addEventListener('click', closePromptModal);
  document.getElementById('savePrompt').addEventListener('click', savePrompt);

  document.getElementById('addLabelToPrompt').addEventListener('click', addLabelToPrompt);
  document.getElementById('labelInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addLabelToPrompt();
  });
  document.getElementById('labelInput').addEventListener('input', () => {
    renderLabelSuggestions();
  });

  document.getElementById('closeGroupModal').addEventListener('click', closeGroupModal);
  document.getElementById('closeGroupModalBtn').addEventListener('click', closeGroupModal);
  document.getElementById('addNewGroupBtn').addEventListener('click', () => {
    closeGroupModal();
    openCreateGroupModal();
  });

  document.getElementById('closeLabelModal').addEventListener('click', closeLabelModal);
  document.getElementById('closeLabelModalBtn').addEventListener('click', closeLabelModal);

  document.getElementById('closeCreateGroupModal').addEventListener('click', closeCreateGroupModal);
  document.getElementById('cancelCreateGroup').addEventListener('click', closeCreateGroupModal);
  document.getElementById('confirmCreateGroup').addEventListener('click', createGroup);

  document.getElementById('closeAppendPromptModal').addEventListener('click', closeAppendModal);
  document.getElementById('cancelAppendPrompt').addEventListener('click', closeAppendModal);
  document.getElementById('confirmAppendPrompt').addEventListener('click', confirmAppend);
  document.getElementById('appendSearchInput').addEventListener('input', renderAppendList);

  document.getElementById('closeSegmentViewModal').addEventListener('click', closeSegmentView);
  document.getElementById('segmentViewCloseBtn').addEventListener('click', closeSegmentView);

  document.getElementById('closeSettingsModal').addEventListener('click', closeSettingsModal);
  document.getElementById('saveSettings').addEventListener('click', saveSettings);

  document.getElementById('exportBtn').addEventListener('click', exportPrompts);
  document.getElementById('importBtn').addEventListener('click', importPrompts);
  document.getElementById('clearDataBtn').addEventListener('click', clearAllData);

  document.getElementById('closeNotification').addEventListener('click', hideNotification);
}

function setupDelegatedEventListeners() {
  document.getElementById('promptsList').addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      const action = actionEl.getAttribute('data-action');
      const id = actionEl.getAttribute('data-id');

      if (action === 'edit') { editPrompt(id); return; }
      if (action === 'copy') { copyPrompt(id); return; }
      if (action === 'delete') { deletePrompt(id); return; }
      if (action === 'toggle-expand') {
        if (expandedPromptIds.has(id)) expandedPromptIds.delete(id);
        else expandedPromptIds.add(id);
        renderPrompts();
        return;
      }
      if (action === 'copy-segment' || action === 'paste-segment' || action === 'view-segment') {
        const promptId = actionEl.getAttribute('data-prompt-id');
        const segmentId = actionEl.getAttribute('data-segment-id');
        const prompt = prompts.find(p => p.id === promptId);
        if (!prompt || !Array.isArray(prompt.segments)) return;
        const seg = prompt.segments.find(s => s.id === segmentId);
        if (!seg) return;
        if (action === 'paste-segment') {
          pasteSegment(promptId, segmentId);
        } else if (action === 'view-segment') {
          openSegmentView(seg.text);
        } else {
          copySegment(promptId, segmentId);
        }
        return;
      }
      if (action === 'delete-segment') {
        const promptId = actionEl.getAttribute('data-prompt-id');
        const segmentId = actionEl.getAttribute('data-segment-id');
        deleteSegment(promptId, segmentId);
        return;
      }
      return;
    }

    // Click on the prompt body (single-segment) → paste
    const promptItem = e.target.closest('.prompt-item');
    if (!promptItem) return;
    const pid = promptItem.getAttribute('data-id');
    const prompt = prompts.find(p => p.id === pid);
    if (!prompt) return;
    if (getSegmentCount(prompt) > 1) {
      // Toggle expand for multi-segment prompts instead of pasting
      e.stopPropagation();
      if (expandedPromptIds.has(pid)) expandedPromptIds.delete(pid);
      else expandedPromptIds.add(pid);
      renderPrompts();
    } else if (settings.clickToCopy) {
      handlePromptClick(pid);
    }
  });

  document.getElementById('groupsList').addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.getAttribute('data-action');
    const name = actionEl.getAttribute('data-name');
    if (action === 'rename') renameGroup(name);
    else if (action === 'delete') deleteGroup(name);
  });

  document.getElementById('selectedLabels').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="remove-label"]');
    if (!btn) return;
    removeLabelFromPrompt(btn.getAttribute('data-label'));
  });

  document.getElementById('labelSuggestions').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-action="add-suggested-label"]');
    if (!chip) return;
    const label = chip.getAttribute('data-label');
    if (label && !selectedPromptLabels.includes(label)) {
      selectedPromptLabels.push(label);
      renderSelectedLabels();
    }
  });

  document.getElementById('labelsList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="delete-label"]');
    if (!btn) return;
    deleteLabel(btn.getAttribute('data-name'));
  });

  document.getElementById('appendPromptsList').addEventListener('click', (e) => {
    const item = e.target.closest('[data-action="select-append-target"]');
    if (!item) return;
    selectAppendTarget(item.getAttribute('data-id'));
  });
}

function updateGroupDropdowns() {
  const groupSelect = document.getElementById('groupSelect');
  const promptGroup = document.getElementById('promptGroup');

  groupSelect.innerHTML = '';
  promptGroup.innerHTML = '';

  groups.forEach(group => {
    const opt1 = document.createElement('option');
    opt1.value = group;
    opt1.textContent = group;
    if (group === currentGroup) opt1.selected = true;
    groupSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = group;
    opt2.textContent = group;
    promptGroup.appendChild(opt2);
  });
}

function updateLabelFilter() {
  const labelFilter = document.getElementById('labelFilter');
  labelFilter.innerHTML = '';

  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = 'All Labels';
  labelFilter.appendChild(allOpt);

  labels.forEach(label => {
    const opt = document.createElement('option');
    opt.value = label;
    opt.textContent = label;
    if (label === currentLabel) opt.selected = true;
    labelFilter.appendChild(opt);
  });
}

function getSegmentCount(prompt) {
  if (Array.isArray(prompt.segments)) return prompt.segments.length;
  return typeof prompt.text === 'string' ? 1 : 0;
}

function getFirstSegmentText(prompt) {
  if (Array.isArray(prompt.segments) && prompt.segments.length > 0) return prompt.segments[0].text;
  return prompt.text || '';
}

function renderPrompts() {
  const promptsList = document.getElementById('promptsList');
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  let filteredPrompts = prompts.filter(prompt => {
    const matchesGroup = prompt.group === currentGroup;
    const matchesLabel = currentLabel === 'all' || (prompt.labels && prompt.labels.includes(currentLabel));
    const firstText = getFirstSegmentText(prompt);
    const matchesSearch = !searchTerm ||
      prompt.title.toLowerCase().includes(searchTerm) ||
      firstText.toLowerCase().includes(searchTerm);

    return matchesGroup && matchesLabel && matchesSearch;
  });

  if (filteredPrompts.length === 0) {
    promptsList.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const p = document.createElement('p');
    p.textContent = t('emptyState');
    empty.appendChild(p);
    promptsList.appendChild(empty);
    return;
  }

  promptsList.innerHTML = '';
  const safeHighlightColor = sanitizeColor(settings.highlightColor);
  const highlightStyle = safeHighlightColor
    ? `background-color: ${safeHighlightColor}20; border-left: 3px solid ${safeHighlightColor};`
    : '';

  filteredPrompts.forEach(prompt => {
    const segCount = getSegmentCount(prompt);
    const isMulti = segCount > 1;
    const isExpanded = expandedPromptIds.has(prompt.id);

    // --- prompt item wrapper ---
    const item = document.createElement('div');
    item.className = 'prompt-item';
    item.setAttribute('data-id', prompt.id);

    // --- header row (always visible) ---
    const header = document.createElement('div');
    header.className = 'prompt-header';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'prompt-title';
    titleDiv.innerHTML = highlightText(escapeHtml(prompt.title), searchTerm);

    const badge = document.createElement('span');
    badge.className = 'segment-badge';
    badge.textContent = isMulti ? `\u2022 ${segCount}` : '';
    titleDiv.appendChild(badge);

    header.appendChild(titleDiv);

    if (isMulti) {
      const expandBtn = document.createElement('button');
      expandBtn.className = 'expand-toggle-btn';
      expandBtn.textContent = isExpanded ? '\u25B2' : '\u25BC';
      expandBtn.title = isExpanded ? t('collapsePrompt') : t('expandPrompt');
      expandBtn.setAttribute('data-action', 'toggle-expand');
      expandBtn.setAttribute('data-id', prompt.id);
      header.appendChild(expandBtn);
    }

    item.appendChild(header);

    // --- body (text preview or expanded segments) ---
    if (isMulti && isExpanded) {
      const segmentsDiv = document.createElement('div');
      segmentsDiv.className = 'prompt-segments';

      prompt.segments.forEach((seg, idx) => {
        const segRow = document.createElement('div');
        segRow.className = 'segment-item';

        const segNum = document.createElement('span');
        segNum.className = 'segment-num';
        segNum.textContent = `#${idx + 1}`;
        segRow.appendChild(segNum);

        const segText = document.createElement('div');
        segText.className = 'segment-text';
        segText.innerHTML = highlightText(escapeHtml(seg.text.slice(0, 120) + (seg.text.length > 120 ? '...' : '')), searchTerm);
        segText.setAttribute('data-action', 'paste-segment');
        segText.setAttribute('data-prompt-id', prompt.id);
        segText.setAttribute('data-segment-id', seg.id);
        segText.title = t('titleClickToCopy');
        segRow.appendChild(segText);

        const segActions = document.createElement('div');
        segActions.className = 'segment-actions';

        const copySegBtn = document.createElement('button');
        copySegBtn.textContent = t('btnCopy');
        copySegBtn.setAttribute('data-action', 'copy-segment');
        copySegBtn.setAttribute('data-prompt-id', prompt.id);
        copySegBtn.setAttribute('data-segment-id', seg.id);
        segActions.appendChild(copySegBtn);

        const viewSegBtn = document.createElement('button');
        viewSegBtn.textContent = t('btnView');
        viewSegBtn.setAttribute('data-action', 'view-segment');
        viewSegBtn.setAttribute('data-prompt-id', prompt.id);
        viewSegBtn.setAttribute('data-segment-id', seg.id);
        segActions.appendChild(viewSegBtn);

        const delSegBtn = document.createElement('button');
        delSegBtn.className = 'delete-btn';
        delSegBtn.textContent = t('btnDelete');
        delSegBtn.setAttribute('data-action', 'delete-segment');
        delSegBtn.setAttribute('data-prompt-id', prompt.id);
        delSegBtn.setAttribute('data-segment-id', seg.id);
        segActions.appendChild(delSegBtn);

        segRow.appendChild(segActions);
        segmentsDiv.appendChild(segRow);
      });

      item.appendChild(segmentsDiv);
    } else {
      // Single segment or collapsed multi: show a text preview
      const textDiv = document.createElement('div');
      textDiv.className = 'prompt-text';
      const previewText = getFirstSegmentText(prompt);
      textDiv.innerHTML = highlightText(escapeHtml(previewText), searchTerm);
      item.appendChild(textDiv);
    }

    // --- labels ---
    if (settings.showLabels && prompt.labels && prompt.labels.length > 0) {
      const labelsDiv = document.createElement('div');
      labelsDiv.className = 'prompt-labels';
      prompt.labels.forEach(label => {
        const span = document.createElement('span');
        span.className = 'label-tag';
        if (highlightStyle) span.setAttribute('style', highlightStyle);
        span.textContent = label;
        labelsDiv.appendChild(span);
      });
      item.appendChild(labelsDiv);
    }

    // --- action buttons (edit / copy / delete prompt level) ---
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'prompt-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = t('btnEdit');
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-id', prompt.id);
    actionsDiv.appendChild(editBtn);

    const copyBtn = document.createElement('button');
    copyBtn.textContent = t('btnCopy');
    copyBtn.setAttribute('data-action', 'copy');
    copyBtn.setAttribute('data-id', prompt.id);
    actionsDiv.appendChild(copyBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = t('btnDelete');
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.setAttribute('data-id', prompt.id);
    actionsDiv.appendChild(deleteBtn);

    item.appendChild(actionsDiv);
    promptsList.appendChild(item);
  });
}

function updatePromptCount() {
  const count = prompts.filter(p => p.group === currentGroup).length;
  document.getElementById('promptCount').textContent = t('totalCount', { count: count, plural: count !== 1 ? 's' : '' });
}

function openPromptModal(promptId = null) {
  editingPromptId = promptId;
  selectedPromptLabels = [];

  if (promptId) {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      document.getElementById('modalTitle').textContent = t('modalEditPrompt');
      document.getElementById('promptTitle').value = prompt.title;
      document.getElementById('promptText').value = getFirstSegmentText(prompt);
      document.getElementById('promptGroup').value = prompt.group;
      selectedPromptLabels = [...(prompt.labels || [])];
    }
  } else {
    document.getElementById('modalTitle').textContent = t('modalCreatePrompt');
    document.getElementById('promptTitle').value = '';
    document.getElementById('promptText').value = '';
    document.getElementById('promptGroup').value = currentGroup;
  }

  renderSelectedLabels();
  document.getElementById('promptModal').classList.add('active');
}

function closePromptModal() {
  document.getElementById('promptModal').classList.remove('active');
  editingPromptId = null;
  selectedPromptLabels = [];
}

async function savePrompt() {
  const title = document.getElementById('promptTitle').value.trim().slice(0, MAX_STRING_LENGTH);
  const text = document.getElementById('promptText').value.trim().slice(0, MAX_TEXT_LENGTH);
  const group = document.getElementById('promptGroup').value;

  if (!title || !text) {
    showNotification(t('notifFillFields'), true);
    return;
  }

  if (!(await confirmSuspiciousContent(title, text, ...selectedPromptLabels))) {
    return;
  }

  if (editingPromptId) {
    const index = prompts.findIndex(p => p.id === editingPromptId);
    if (index !== -1) {
      const existing = prompts[index];
      prompts[index] = {
        ...existing,
        title,
        text: undefined,
        segments: Array.isArray(existing.segments) && existing.segments.length > 0
          ? existing.segments.map(s => s.id === existing.segments[0].id ? { ...s, text } : s)
          : [{ id: generateId(), text, createdAt: Date.now() }],
        group,
        labels: [...selectedPromptLabels],
        updatedAt: Date.now()
      };
    }
  } else {
    if (prompts.length >= MAX_PROMPT_COUNT) {
      showNotification(t('notifMaxPrompts'), true);
      return;
    }
    const newPrompt = {
      id: generateId(),
      title,
      segments: [{ id: generateId(), text, createdAt: Date.now() }],
      group,
      labels: [...selectedPromptLabels],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    prompts.push(newPrompt);
  }

  savePrompts();
  closePromptModal();
  renderPrompts();
  updatePromptCount();
  showNotification(editingPromptId ? t('notifPromptUpdated') : t('notifPromptSaved'));
}

function editPrompt(id) {
  openPromptModal(id);
}

function copyPrompt(id) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;

  confirmCopyPasteSuspiciousContent(prompt.title, getFirstSegmentText(prompt), ...(prompt.labels || [])).then(ok => {
    if (ok) copyPromptRaw(id);
  });
}

// Performs the actual clipboard write without any content warning check.
// Used internally once a warning (if any) has already been confirmed.
function copyPromptRaw(id) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;
  copyToClipboard(getFirstSegmentText(prompt)).then(() => {
    showNotification(t('notifPromptCopied'));
  }).catch(() => {
    showNotification(t('notifCopyFailed'), true);
  });
}

function copySegment(promptId, segmentId) {
  const prompt = prompts.find(p => p.id === promptId);
  if (!prompt || !Array.isArray(prompt.segments)) return;
  const seg = prompt.segments.find(s => s.id === segmentId);
  if (!seg) return;
  copyToClipboard(seg.text).then(() => {
    showNotification(t('notifPromptCopied'));
  }).catch(() => {
    showNotification(t('notifCopyFailed'), true);
  });
}

function pasteSegment(promptId, segmentId) {
  const prompt = prompts.find(p => p.id === promptId);
  if (!prompt || !Array.isArray(prompt.segments)) return;
  const seg = prompt.segments.find(s => s.id === segmentId);
  if (!seg) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) {
      copyToClipboard(seg.text).then(() => showNotification(t('notifPromptCopied')))
        .catch(() => showNotification(t('notifCopyFailed'), true));
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'pasteToActiveElement',
      text: seg.text
    }, (response) => {
      if (chrome.runtime.lastError || !response || !response.hasTarget) {
        copyToClipboard(seg.text).then(() => showNotification(t('notifPromptCopied')))
          .catch(() => showNotification(t('notifCopyFailed'), true));
        return;
      }
      window.close();
    });
  });
}

function deleteSegment(promptId, segmentId) {
  const prompt = prompts.find(p => p.id === promptId);
  if (!prompt || !Array.isArray(prompt.segments)) return;
  const segCount = prompt.segments.length;

  if (segCount <= 1) {
    // Last segment — delete the entire prompt
    if (confirm(t('confirmDeleteLastSegment'))) {
      prompts = prompts.filter(p => p.id !== promptId);
      savePrompts();
      renderPrompts();
      updatePromptCount();
      showNotification(t('notifPromptDeleted'));
    }
    return;
  }

  if (confirm(t('confirmDeleteSegment'))) {
    prompt.segments = prompt.segments.filter(s => s.id !== segmentId);
    prompt.updatedAt = Date.now();
    savePrompts();
    renderPrompts();
    showNotification(t('notifSegmentDeleted'));
  }
}

function openSegmentView(text) {
  document.getElementById('segmentViewText').textContent = text;
  document.getElementById('segmentViewModal').classList.add('active');
}

function closeSegmentView() {
  document.getElementById('segmentViewModal').classList.remove('active');
}

function deletePrompt(id) {
  if (confirm(t('confirmDeletePrompt'))) {
    prompts = prompts.filter(p => p.id !== id);
    savePrompts();
    renderPrompts();
    updatePromptCount();
    showNotification(t('notifPromptDeleted'));
  }
}

async function addLabelToPrompt() {
  const input = document.getElementById('labelInput');
  const label = sanitizeString(input.value.trim());

  if (!label || selectedPromptLabels.includes(label)) return;

  if (!(await confirmSuspiciousContent(label))) return;

  selectedPromptLabels.push(label);

  if (!labels.includes(label)) {
    labels.push(label);
    saveLabels();
    updateLabelFilter();
  }

  renderSelectedLabels();
  input.value = '';
  renderLabelSuggestions();
}

function removeLabelFromPrompt(label) {
  selectedPromptLabels = selectedPromptLabels.filter(l => l !== label);
  renderSelectedLabels();
}

function renderSelectedLabels() {
  const container = document.getElementById('selectedLabels');
  container.innerHTML = '';
  selectedPromptLabels.forEach(label => {
    const span = document.createElement('span');
    span.className = 'selected-label';
    span.appendChild(document.createTextNode(label + ' '));

    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.setAttribute('data-action', 'remove-label');
    btn.setAttribute('data-label', label);
    span.appendChild(btn);

    container.appendChild(span);
  });

  renderLabelSuggestions();
}

function renderLabelSuggestions() {
  const container = document.getElementById('labelSuggestions');
  container.innerHTML = '';

  const searchTerm = (document.getElementById('labelInput').value || '').trim().toLowerCase();

  let available = labels.filter(l => !selectedPromptLabels.includes(l));
  if (searchTerm) {
    available = available.filter(l => l.toLowerCase().includes(searchTerm));
  }

  if (available.length === 0) return;

  const header = document.createElement('span');
  header.className = 'label-suggestions-label';
  header.textContent = searchTerm ? t('labelSuggestionsFilter') : t('labelSuggestionsTitle');
  container.appendChild(header);

  available.forEach(label => {
    const chip = document.createElement('span');
    chip.className = 'label-suggestion';
    chip.textContent = label;
    chip.setAttribute('data-action', 'add-suggested-label');
    chip.setAttribute('data-label', label);
    chip.title = `Click to add "${label}"`;
    container.appendChild(chip);
  });
}

function addLabel(name) {
  if (!labels.includes(name)) {
    labels.push(name);
    saveLabels();
    updateLabelFilter();
    showNotification(t('notifLabelAdded'));
  }
}

function openLabelModal() {
  renderLabelsList();
  document.getElementById('labelModal').classList.add('active');
}

function closeLabelModal() {
  document.getElementById('labelModal').classList.remove('active');
}

function renderLabelsList() {
  const container = document.getElementById('labelsList');
  container.innerHTML = '';

  if (labels.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const p = document.createElement('p');
    p.textContent = t('noLabelsYet');
    empty.appendChild(p);
    container.appendChild(empty);
    return;
  }

  labels.forEach(label => {
    const count = prompts.filter(p => p.labels && p.labels.includes(label)).length;
    const item = document.createElement('div');
    item.className = 'group-item';

    const info = document.createElement('div');
    info.className = 'group-info';
    const nameDiv = document.createElement('div');
    nameDiv.className = 'group-name';
    nameDiv.textContent = label;
    info.appendChild(nameDiv);
    const descDiv = document.createElement('div');
    descDiv.className = 'group-description';
    descDiv.textContent = t('labelUsageCount', { count: count, plural: count !== 1 ? 's' : '' });
    info.appendChild(descDiv);
    item.appendChild(info);

    const actions = document.createElement('div');
    actions.className = 'group-actions';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = t('btnDelete');
    deleteBtn.setAttribute('data-action', 'delete-label');
    deleteBtn.setAttribute('data-name', label);
    actions.appendChild(deleteBtn);
    item.appendChild(actions);

    container.appendChild(item);
  });
}

function deleteLabel(name) {
  if (confirm(t('confirmDeleteLabel', { name: name, count: prompts.filter(p => p.labels && p.labels.includes(name)).length, plural: prompts.filter(p => p.labels && p.labels.includes(name)).length !== 1 ? 's' : '' }))) {
    labels = labels.filter(l => l !== name);
    prompts.forEach(prompt => {
      if (prompt.labels) {
        prompt.labels = prompt.labels.filter(l => l !== name);
      }
    });
    if (currentLabel === name) {
      currentLabel = 'all';
    }
    saveLabels();
    savePrompts();
    updateLabelFilter();
    renderLabelsList();
    renderPrompts();
    updatePromptCount();
    showNotification(t('notifLabelDeleted'));
  }
}

function openGroupModal() {
  renderGroupsList();
  document.getElementById('groupModal').classList.add('active');
}

function closeGroupModal() {
  document.getElementById('groupModal').classList.remove('active');
}

function renderGroupsList() {
  const container = document.getElementById('groupsList');
  container.innerHTML = '';
  groups.forEach(group => {
    const item = document.createElement('div');
    item.className = `group-item ${group === 'General' ? 'default' : ''}`;

    const info = document.createElement('div');
    info.className = 'group-info';
    const nameDiv = document.createElement('div');
    nameDiv.className = 'group-name';
    nameDiv.textContent = group;
    info.appendChild(nameDiv);
    const descDiv = document.createElement('div');
    descDiv.className = 'group-description';
    descDiv.textContent = `${prompts.filter(p => p.group === group).length} prompts`;
    info.appendChild(descDiv);
    item.appendChild(info);

    const actions = document.createElement('div');
    actions.className = 'group-actions';
    if (group !== 'General') {
      const renameBtn = document.createElement('button');
      renameBtn.textContent = t('btnRename');
      renameBtn.setAttribute('data-action', 'rename');
      renameBtn.setAttribute('data-name', group);
      actions.appendChild(renameBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = t('btnDelete');
      deleteBtn.setAttribute('data-action', 'delete');
      deleteBtn.setAttribute('data-name', group);
      actions.appendChild(deleteBtn);
    } else {
      const span = document.createElement('span');
      span.style.fontSize = '12px';
      span.style.color = '#888';
      span.textContent = t('defaultTag');
      actions.appendChild(span);
    }
    item.appendChild(actions);

    container.appendChild(item);
  });
}

function openCreateGroupModal() {
  document.getElementById('groupName').value = '';
  document.getElementById('groupDescription').value = '';
  document.getElementById('createGroupModal').classList.add('active');
}

function closeCreateGroupModal() {
  document.getElementById('createGroupModal').classList.remove('active');
}

async function createGroup() {
  const name = sanitizeString(document.getElementById('groupName').value.trim());

  if (!name) {
    showNotification(t('notifGroupNameRequired'), true);
    return;
  }

  if (name.length > MAX_STRING_LENGTH) {
    showNotification(t('notifGroupNameTooLong'), true);
    return;
  }

  if (groups.includes(name)) {
    showNotification(t('notifGroupExists'), true);
    return;
  }

  if (!(await confirmSuspiciousContent(name))) {
    return;
  }

  groups.push(name);
  saveGroups();
  updateGroupDropdowns();
  closeCreateGroupModal();
  showNotification(t('notifGroupCreated'));
}

async function renameGroup(oldName) {
  const newName = sanitizeString(prompt(t('promptGroupName'), oldName));

  if (newName && newName !== oldName) {
    if (newName.length > MAX_STRING_LENGTH) {
      showNotification(t('notifGroupNameTooLong'), true);
      return;
    }

    if (groups.includes(newName)) {
      showNotification(t('notifGroupExists'), true);
      return;
    }

    if (!(await confirmSuspiciousContent(newName))) {
      return;
    }

    const index = groups.indexOf(oldName);
    if (index !== -1) {
      groups[index] = newName;

      prompts.forEach(prompt => {
        if (prompt.group === oldName) {
          prompt.group = newName;
        }
      });

      if (currentGroup === oldName) {
        currentGroup = newName;
        saveCurrentGroup();
      }

      saveGroups();
      savePrompts();
      updateGroupDropdowns();
      renderPrompts();
      renderGroupsList();
      showNotification(t('notifGroupRenamed'));
    }
  }
}

function deleteGroup(name) {
  if (confirm(t('confirmDeleteGroup', { name: name }))) {
    prompts = prompts.filter(prompt => prompt.group !== name);

    groups = groups.filter(g => g !== name);

    if (currentGroup === name) {
      currentGroup = 'General';
      saveCurrentGroup();
    }

    saveGroups();
    savePrompts();
    updateGroupDropdowns();
    renderPrompts();
    renderGroupsList();
    updatePromptCount();
    showNotification(t('notifGroupDeleted'));
  }
}

function openSettingsModal() {
  document.getElementById('themeSelect').value = currentTheme;
  document.getElementById('languageSelect').value = currentLanguage;
  document.getElementById('enableSearch').checked = settings.enableSearch;
  document.getElementById('showLabels').checked = settings.showLabels;
  document.getElementById('defaultToLastGroup').checked = settings.defaultToLastGroup;
  document.getElementById('showContextMenu').checked = settings.showContextMenu;
  document.getElementById('autoFillTitle').checked = settings.autoFillTitle;
  document.getElementById('includePageUrl').checked = settings.includePageUrl;
  document.getElementById('includePageTitle').checked = settings.includePageTitle;
  document.getElementById('highlightColor').value = settings.highlightColor || '#4a90d9';
  document.getElementById('clickToCopy').checked = settings.clickToCopy;
  document.getElementById('warnOnSuspiciousContent').checked = settings.warnOnSuspiciousContent;
  document.getElementById('warnOnCopyPaste').checked = settings.warnOnCopyPaste;
  document.getElementById('settingsModal').classList.add('active');
}

function closeSettingsModal() {
  document.getElementById('settingsModal').classList.remove('active');
}

function saveSettings() {
  settings.enableSearch = document.getElementById('enableSearch').checked;
  settings.showLabels = document.getElementById('showLabels').checked;
  settings.defaultToLastGroup = document.getElementById('defaultToLastGroup').checked;
  settings.showContextMenu = document.getElementById('showContextMenu').checked;
  settings.autoFillTitle = document.getElementById('autoFillTitle').checked;
  settings.includePageUrl = document.getElementById('includePageUrl').checked;
  settings.includePageTitle = document.getElementById('includePageTitle').checked;
  settings.highlightColor = sanitizeColor(document.getElementById('highlightColor').value) || '#4a90d9';
  settings.clickToCopy = document.getElementById('clickToCopy').checked;
  settings.warnOnSuspiciousContent = document.getElementById('warnOnSuspiciousContent').checked;
  settings.warnOnCopyPaste = document.getElementById('warnOnCopyPaste').checked;
  settings.language = document.getElementById('languageSelect').value;

  chrome.storage.local.set({ settings });
  closeSettingsModal();
  renderPrompts();
  showNotification(t('notifSettingsSaved'));
}

function exportPrompts() {
  const data = {
    prompts,
    groups,
    labels,
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-prompts-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification(t('notifExportOK'));
}

function importPrompts() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showNotification(t('notifFileTooLarge'), true);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      let data;
      try {
        data = JSON.parse(event.target.result);
      } catch (error) {
        showNotification(t('notifInvalidJSON'), true);
        return;
      }

      if (!data || typeof data !== 'object') {
        showNotification(t('notifInvalidFormat'), true);
        return;
      }

      try {
        const importedPrompts = Array.isArray(data.prompts) ? data.prompts.filter(isValidPrompt) : [];
        const importedGroups = Array.isArray(data.groups)
          ? data.groups.map(sanitizeString).filter(g => g && !groups.includes(g))
          : [];
        const importedLabels = Array.isArray(data.labels)
          ? data.labels.map(sanitizeString).filter(l => l && !labels.includes(l))
          : [];

        if (settings.warnOnSuspiciousContent) {
          const allFindings = new Set();
          importedPrompts.forEach(p => {
            detectSuspiciousContent(p.title).forEach(f => allFindings.add(f));
            detectSuspiciousContent(getFirstSegmentText(p)).forEach(f => allFindings.add(f));
            (p.segments || []).forEach(s => detectSuspiciousContent(s.text).forEach(f => allFindings.add(f)));
            (p.labels || []).forEach(l => detectSuspiciousContent(l).forEach(f => allFindings.add(f)));
          });
          importedGroups.forEach(g => detectSuspiciousContent(g).forEach(f => allFindings.add(f)));
          importedLabels.forEach(l => detectSuspiciousContent(l).forEach(f => allFindings.add(f)));

          if (allFindings.size > 0) {
            const proceed = await showSecurityWarningModal('secWarningIntroImport', Array.from(allFindings));
            if (!proceed) {
              showNotification(t('notifImportCancelled'), true);
              return;
            }
          }
        }

        const availableSlots = MAX_PROMPT_COUNT - prompts.length;
        if (importedPrompts.length > availableSlots) {
          showNotification(t('notifImportMaxReached', { count: availableSlots }), true);
        }
        prompts = [...prompts, ...importedPrompts.slice(0, Math.max(0, availableSlots))];
        groups = [...groups, ...importedGroups];
        labels = [...labels, ...importedLabels];

        savePrompts();
        saveGroups();
        saveLabels();
        updateGroupDropdowns();
        updateLabelFilter();
        renderPrompts();
        updatePromptCount();
        showNotification(t('notifImportOK'));
      } catch (error) {
        showNotification(t('notifImportError'), true);
      }
    };
    reader.onerror = () => showNotification(t('notifReadError'), true);
    reader.readAsText(file);
  };

  input.click();
}

function clearAllData() {
  if (confirm(t('confirmClearAll'))) {
    prompts = [];
    groups = ['General'];
    labels = [];
    currentGroup = 'General';
    currentLabel = 'all';

    chrome.storage.local.clear(() => {
      savePrompts();
      saveGroups();
      saveLabels();
      saveCurrentGroup();
      updateGroupDropdowns();
      updateLabelFilter();
      renderPrompts();
      updatePromptCount();
      showNotification(t('notifDataCleared'));
    });
  }
}

function checkPendingPrompt() {
  chrome.runtime.sendMessage({ action: 'getPendingPrompt' }, (response) => {
    if (chrome.runtime.lastError) return;
    if (response && response.pendingPrompt) {
      const pending = response.pendingPrompt;
      const pendingText = sanitizeString(pending.text || '');
      if (!pendingText) {
        chrome.runtime.sendMessage({ action: 'clearPendingPrompt' });
        return;
      }

      // Page info (title / URL) goes into the title field, not the text.
      const pageTitle = sanitizeString(pending.pageTitle || '');
      const pageUrl = sanitizeString(pending.pageUrl || '');

      if (pending.mode === 'append') {
        openAppendModal(pendingText);
        chrome.runtime.sendMessage({ action: 'clearPendingPrompt' });
        return;
      }

      if (pending.mode === 'appendToLast') {
        let latest = null;
        prompts.forEach(p => {
          if (!latest || (p.createdAt && p.createdAt > (latest.createdAt || 0))) {
            latest = p;
          }
        });
        if (latest) {
          if (!Array.isArray(latest.segments)) latest.segments = [];
          latest.segments.push({ id: generateId(), text: pendingText, createdAt: Date.now() });
          latest.updatedAt = Date.now();
          savePrompts();
          renderPrompts();
          showNotification(t('notifAppendedToLast', { title: latest.title }));
        }
        chrome.runtime.sendMessage({ action: 'clearPendingPrompt' });
        return;
      }

      openPromptModal();

      // Build the title from page info or auto-fill from text
      if (pageTitle) {
        document.getElementById('promptTitle').value = pageTitle;
      } else if (pageUrl) {
        document.getElementById('promptTitle').value = pageUrl;
      } else if (settings.autoFillTitle) {
        const title = pendingText.substring(0, 50) + (pendingText.length > 50 ? '...' : '');
        document.getElementById('promptTitle').value = title;
      }

      document.getElementById('promptText').value = pendingText;

      chrome.runtime.sendMessage({ action: 'clearPendingPrompt' });
    }
  });
}

function openAppendModal(text) {
  pendingAppendText = text;
  selectedAppendId = null;
  document.getElementById('appendSearchInput').value = '';
  document.getElementById('confirmAppendPrompt').disabled = true;
  renderAppendList();
  updateAppendPreview();
  document.getElementById('appendPromptModal').classList.add('active');
}

function closeAppendModal() {
  document.getElementById('appendPromptModal').classList.remove('active');
  pendingAppendText = null;
  selectedAppendId = null;
}

function renderAppendList() {
  const container = document.getElementById('appendPromptsList');
  container.innerHTML = '';

  const searchTerm = document.getElementById('appendSearchInput').value.toLowerCase();

  const sorted = [...prompts].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const filtered = sorted.filter(p =>
    !searchTerm ||
    p.title.toLowerCase().includes(searchTerm) ||
    getFirstSegmentText(p).toLowerCase().includes(searchTerm)
  );

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const p = document.createElement('p');
    p.textContent = t('appendEmptyHint');
    empty.appendChild(p);
    container.appendChild(empty);
    return;
  }

  filtered.forEach(prompt => {
    const item = document.createElement('div');
    item.className = 'append-prompt-item' + (prompt.id === selectedAppendId ? ' selected' : '');
    item.setAttribute('data-action', 'select-append-target');
    item.setAttribute('data-id', prompt.id);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'append-item-title';
    titleDiv.textContent = prompt.title;
    item.appendChild(titleDiv);

    const metaDiv = document.createElement('div');
    metaDiv.className = 'append-item-meta';
    metaDiv.textContent = prompt.group;
    item.appendChild(metaDiv);

    container.appendChild(item);
  });
}

function selectAppendTarget(id) {
  selectedAppendId = id;
  document.getElementById('confirmAppendPrompt').disabled = false;
  renderAppendList();
  updateAppendPreview();
}

// Shows the combined result as plain text: existing content, a divider
// line, then the new segment — exactly as it will be stored.
function updateAppendPreview() {
  const preview = document.getElementById('appendPreview');
  const prompt = prompts.find(p => p.id === selectedAppendId);
  if (!prompt || pendingAppendText == null) {
    preview.textContent = t('appendPreviewEmpty');
    return;
  }
  const existing = getFirstSegmentText(prompt);
  preview.textContent = existing + APPEND_DIVIDER + pendingAppendText;
}

function confirmAppend() {
  const prompt = prompts.find(p => p.id === selectedAppendId);
  if (!prompt || pendingAppendText == null) return;

  if (!Array.isArray(prompt.segments)) prompt.segments = [];
  prompt.segments.push({ id: generateId(), text: pendingAppendText, createdAt: Date.now() });
  delete prompt.text;
  prompt.updatedAt = Date.now();

  savePrompts();
  closeAppendModal();
  renderPrompts();
  showNotification(t('notifAppended'));
}

function savePrompts() {
  chrome.storage.local.set({ prompts });
}

function saveGroups() {
  chrome.storage.local.set({ groups });
}

function saveLabels() {
  chrome.storage.local.set({ labels });
}

function saveCurrentGroup() {
  chrome.storage.local.set({ currentGroup });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

function highlightText(text, searchTerm) {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
  const highlightColor = sanitizeColor(settings.highlightColor) || '#4a90d9';
  return text.replace(regex, `<span class="search-highlight" style="background-color: ${highlightColor}30; color: ${highlightColor}; font-weight: 600;">$1</span>`);
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function handlePromptClick(id) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;
  const firstText = getFirstSegmentText(prompt);

  // Single warning check up front for this action, whether it ends up
  // pasting into the page or falling back to a clipboard copy below.
  // Uses the custom in-popup modal (not window.confirm) since native
  // dialogs can cause Chrome to prematurely close the action popup,
  // which would silently abort the paste before it's even sent.
  if (!(await confirmCopyPasteSuspiciousContent(prompt.title, firstText, ...(prompt.labels || [])))) {
    return;
  }

  if (!settings.clickToCopy) {
    copyPromptRaw(id);
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) {
      copyPromptRaw(id);
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'pasteToActiveElement',
      text: firstText
    }, (response) => {
      if (chrome.runtime.lastError || !response || !response.hasTarget) {
        // Content script unreachable (e.g. chrome:// pages) or no editable
        // field is focused on the page. Fall back to clipboard copy, which
        // works reliably here because the popup document still has focus.
        copyPromptRaw(id);
        return;
      }
      // A valid target was confirmed by the content script; it will insert
      // the text either immediately or as soon as the page regains focus.
      // Safe to close now since the message has already been delivered.
      window.close();
    });
  });
}

function showNotification(message, isError = false) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');

  notificationText.textContent = message;
  notification.className = isError ? 'notification error' : 'notification';
  notification.classList.remove('hidden');

  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

function hideNotification() {
  document.getElementById('notification').classList.add('hidden');
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return fallbackCopyToClipboard(text);
}

function fallbackCopyToClipboard(text) {
  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (trimmed.length > MAX_STRING_LENGTH) return trimmed.slice(0, MAX_STRING_LENGTH);
  return trimmed;
}

function sanitizeColor(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return COLOR_REGEX.test(trimmed) ? trimmed : '';
}

// --- XSS content warning filter ---
// This does NOT block saving (content is always safely escaped when
// rendered within this extension). It exists to warn the user *before*
// saving/copying/pasting if their prompt/label/group contains HTML tags
// or script-like patterns, since sharing/pasting that content elsewhere
// could expose others to XSS if the receiving context doesn't escape it.
// Uses a blacklist of known dangerous HTML tags and JS patterns to avoid
// false-positiving on prompt syntax like <lora:2.5> or <topic>.
const XSS_PATTERNS = [
  { name: 'Dangerous HTML tag (e.g. <script>, <iframe>)', regex: /<\/?\s*(script|iframe|object|embed|svg|math|applet|link|meta|base|form|style|frame|frameset|template)\b[^>]*>/i },
  { name: 'HTML tag with attribute (e.g. <div class=...>)', regex: /<[a-zA-Z][a-zA-Z0-9]*\s+[a-zA-Z-]+\s*=\s*["'][^"'<>]*["']/ },
  { name: 'Inline event handler (e.g. onclick=, onerror=)', regex: /\bon[a-z]+\s*=\s*["']/i },
  { name: 'javascript: URI', regex: /javascript\s*:/i },
  { name: 'data:text/html URI', regex: /data\s*:\s*text\/html/i },
  { name: 'eval() / Function() constructor', regex: /\b(eval|Function)\s*\(/ },
  { name: 'document.cookie access', regex: /document\s*\.\s*cookie/i },
  { name: 'CSS expression()', regex: /expression\s*\(/i }
];

function detectSuspiciousContent(text) {
  if (typeof text !== 'string' || !text) return [];
  const found = [];
  for (const pattern of XSS_PATTERNS) {
    if (pattern.regex.test(text)) {
      found.push(pattern.name);
    }
  }
  return found;
}

// Custom in-popup confirmation modal, used instead of the native
// window.confirm(). Native confirm()/alert()/prompt() dialogs are
// unreliable inside a Chrome extension action popup - triggering one in
// the middle of a focus-sensitive flow (like click-to-paste, which
// depends on precise popup/tab focus timing) can cause Chrome to treat
// the popup as having lost focus and close it prematurely, silently
// killing the in-flight action. A custom modal avoids that risk entirely
// and also matches the extension's light/dark theme.
let securityWarningResolve = null;

function setupSecurityWarningModal() {
  document.getElementById('securityWarningCancel').addEventListener('click', () => resolveSecurityWarning(false));
  document.getElementById('closeSecurityWarningModal').addEventListener('click', () => resolveSecurityWarning(false));
  document.getElementById('securityWarningContinue').addEventListener('click', () => resolveSecurityWarning(true));
}

function resolveSecurityWarning(result) {
  document.getElementById('securityWarningModal').classList.remove('active');
  const resolve = securityWarningResolve;
  securityWarningResolve = null;
  if (resolve) resolve(result);
}

function showSecurityWarningModal(actionKey, findings) {
  // If a warning is already open, resolve it as cancelled before opening
  // a new one so we never leave a dangling promise.
  if (securityWarningResolve) {
    resolveSecurityWarning(false);
  }

  document.getElementById('securityWarningIntro').textContent = t(actionKey);

  const list = document.getElementById('securityWarningList');
  list.innerHTML = '';
  findings.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    list.appendChild(li);
  });

  document.getElementById('securityWarningOutro').textContent = t('secWarningOutro');

  document.getElementById('securityWarningModal').classList.add('active');

  return new Promise(resolve => {
    securityWarningResolve = resolve;
  });
}

// Checks the given text fragments for suspicious content and, if the
// "warn before saving" setting is enabled and something was found, asks
// the user to confirm before proceeding. Resolves true if it's OK to
// proceed with saving, false if the user cancelled.
async function confirmSuspiciousContent(...texts) {
  if (!settings.warnOnSuspiciousContent) return true;

  const found = new Set();
  texts.forEach(text => {
    detectSuspiciousContent(text).forEach(name => found.add(name));
  });

  if (found.size === 0) return true;

  return showSecurityWarningModal('secWarningIntroSave', Array.from(found));
}

// Checks the given text fragments for suspicious content and, if the
// "warn on copy/paste" setting is enabled and something was found, asks
// the user to confirm before copying/pasting the prompt elsewhere.
// Resolves true if it's OK to proceed, false if the user cancelled.
async function confirmCopyPasteSuspiciousContent(...texts) {
  if (!settings.warnOnCopyPaste) return true;

  const found = new Set();
  texts.forEach(text => {
    detectSuspiciousContent(text).forEach(name => found.add(name));
  });

  if (found.size === 0) return true;

  return showSecurityWarningModal('secWarningIntroCopy', Array.from(found));
}

function sanitizeSettings(raw) {
  const result = {};
  if (typeof raw.enableSearch === 'boolean') result.enableSearch = raw.enableSearch;
  if (typeof raw.showLabels === 'boolean') result.showLabels = raw.showLabels;
  if (typeof raw.defaultToLastGroup === 'boolean') result.defaultToLastGroup = raw.defaultToLastGroup;
  if (typeof raw.showContextMenu === 'boolean') result.showContextMenu = raw.showContextMenu;
  if (typeof raw.autoFillTitle === 'boolean') result.autoFillTitle = raw.autoFillTitle;
  if (typeof raw.includePageUrl === 'boolean') result.includePageUrl = raw.includePageUrl;
  if (typeof raw.includePageTitle === 'boolean') result.includePageTitle = raw.includePageTitle;
  if (typeof raw.clickToCopy === 'boolean') result.clickToCopy = raw.clickToCopy;
  if (typeof raw.warnOnSuspiciousContent === 'boolean') result.warnOnSuspiciousContent = raw.warnOnSuspiciousContent;
  if (typeof raw.warnOnCopyPaste === 'boolean') result.warnOnCopyPaste = raw.warnOnCopyPaste;
  if (VALID_LANGUAGES.includes(raw.language)) result.language = raw.language;
  if (typeof raw.highlightColor === 'string') {
    const c = sanitizeColor(raw.highlightColor);
    if (c) result.highlightColor = c;
  }
  return result;
}

function isValidPrompt(p) {
  if (!p || typeof p !== 'object') return false;
  if (typeof p.id !== 'string' || !ID_REGEX.test(p.id)) return false;
  if (typeof p.title !== 'string' || p.title.length > MAX_STRING_LENGTH) return false;

  const hasSegments = Array.isArray(p.segments) && p.segments.length > 0 &&
    p.segments.every(s => typeof s.id === 'string' && typeof s.text === 'string' && s.text.length > 0 && s.text.length <= MAX_TEXT_LENGTH);
  const hasLegacyText = typeof p.text === 'string' && p.text.length > 0 && p.text.length <= MAX_TEXT_LENGTH;
  if (!hasSegments && !hasLegacyText) return false;

  if (typeof p.group !== 'string' || p.group.length > MAX_STRING_LENGTH) return false;
  if (p.labels !== undefined && !Array.isArray(p.labels)) return false;
  if (Array.isArray(p.labels)) {
    if (p.labels.some(l => typeof l !== 'string' || l.length > MAX_STRING_LENGTH)) return false;
  }
  return true;
}
