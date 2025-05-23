
const obs0 = new MutationObserver((mutations, observer) => {
    let currentUrl = window.location.href;
    let boardId = currentUrl.substring(21);
    chrome.storage.sync.get((storage) => {
        let blackList = storage.bList;
        if (blackList.length > 0 && blackList[0] !== "") {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;

                    blackList.forEach((keyword) => {
                        if (node.innerText.includes(keyword)) {
                            node.remove(); // ✅ 완전 삭제
                        }
                    });
                });
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    obs0.observe(document.body, { childList: true, subtree: true });
});
