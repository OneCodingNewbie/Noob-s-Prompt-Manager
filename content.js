const EXTENSION_ID = chrome.runtime.id;

const MAX_TEXT_LENGTH = 100000;

let lastFocusedElement = null;
let pendingPaste = null;
let focusHandler = null;

document.addEventListener('focusin', (e) => {
  if (isEditable(e.target)) {
    lastFocusedElement = e.target;
  }
}, true);

function isEditable(el) {
  if (!el) return false;
  if (el.tagName === 'INPUT') {
    const type = (el.type || '').toLowerCase();
    return ['text', 'search', 'url', 'email', 'password', 'tel', 'number', ''].includes(type);
  }
  if (el.tagName === 'TEXTAREA') return true;
  if (el.isContentEditable) return true;
  return false;
}

function getPasteTarget() {
  if (lastFocusedElement && document.contains(lastFocusedElement) && isEditable(lastFocusedElement)) {
    return lastFocusedElement;
  }
  if (isEditable(document.activeElement)) {
    return document.activeElement;
  }
  return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.id !== EXTENSION_ID) {
    sendResponse({ success: false, message: 'unauthorized' });
    return false;
  }

  if (request.action === 'getSelectedText') {
    const selectedText = (window.getSelection().toString() || '').slice(0, MAX_TEXT_LENGTH);
    sendResponse({ selectedText });
    return false;
  }

  if (request.action === 'pasteToActiveElement') {
    const text = typeof request.text === 'string' ? request.text.slice(0, MAX_TEXT_LENGTH) : '';

    if (!text) {
      sendResponse({ success: false, hasTarget: false, message: 'No text provided' });
      return false;
    }

    const target = getPasteTarget();

    if (!target) {
      sendResponse({ success: false, hasTarget: false, message: 'No active input field found' });
      return false;
    }

    // Cancel any previously queued paste before queuing a new one
    if (focusHandler) {
      window.removeEventListener('focus', focusHandler);
      focusHandler = null;
    }
    pendingPaste = { text, target };

    const performPaste = () => {
      const pending = pendingPaste;
      pendingPaste = null;
      focusHandler = null;
      if (!pending) return;

      let el = pending.target;
      if (!el || !document.contains(el) || !isEditable(el)) {
        el = getPasteTarget();
      }
      if (!el) return;

      el.focus();
      let inserted = false;
      try {
        inserted = document.execCommand('insertText', false, pending.text);
      } catch (err) {
        inserted = false;
      }
      if (!inserted) {
        fallbackInsertText(el, pending.text);
      }
    };

    if (document.hasFocus()) {
      performPaste();
    } else {
      focusHandler = () => setTimeout(performPaste, 30);
      window.addEventListener('focus', focusHandler, { once: true });
    }

    // We respond immediately once we've confirmed a valid target exists.
    // The popup can safely close now; the actual insertion happens either
    // synchronously above (if the page already has focus) or once the page
    // regains focus after the popup closes.
    sendResponse({ success: true, hasTarget: true, message: 'Prompt pasted successfully!' });
    return false;
  }

  return false;
});

function fallbackInsertText(element, text) {
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    const proto = element.tagName === 'INPUT' ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    const nativeSetter = descriptor && descriptor.set;

    const start = element.selectionStart != null ? element.selectionStart : element.value.length;
    const end = element.selectionEnd != null ? element.selectionEnd : element.value.length;
    const newValue = element.value.substring(0, start) + text + element.value.substring(end);

    if (nativeSetter) {
      nativeSetter.call(element, newValue);
    } else {
      element.value = newValue;
    }

    element.selectionStart = element.selectionEnd = start + text.length;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (element.isContentEditable) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      selection.collapseToEnd();
    } else {
      element.appendChild(document.createTextNode(text));
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
