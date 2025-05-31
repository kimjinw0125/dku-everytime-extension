export function initContentFunction(types) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;

        types.forEach((type) => {
            chrome.tabs.sendMessage(tabs[0].id, { type });
        });
    });
}

export function reloadTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.reload(tabs[0].id);
        }
    });
}