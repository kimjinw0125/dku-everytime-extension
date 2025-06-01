// board.js — 키워드 걸린 a.list 내부 <p>를 "차단됨"으로 바꾸고, <article class="list">는 삭제

// 익명 자동 체크 (기존 코드)
function forceAnonyClick() {
    const anonyButton = document.querySelector("li.anonym");
    if (anonyButton && !anonyButton.classList.contains("active")) {
        anonyButton.click();
    }
}
chrome.storage.sync.get((storage) => {
    if (storage.setAnony) {
        setInterval(forceAnonyClick, 1000);
    }
});

// 쪽지 찾기 버튼 (기존 코드)
chrome.storage.sync.get("makeSearchButton", (data) => {
    if (data.makeSearchButton) {
        document.addEventListener("DOMContentLoaded", () => {
            const target = document.querySelector(".article .heading");
            if (target && !document.querySelector("#find-message-thread")) {
                const searchBtn = document.createElement("button");
                searchBtn.id = "find-message-thread";
                searchBtn.innerText = "쪽지 시작된 글 찾기";
                searchBtn.style.marginLeft = "10px";
                searchBtn.style.padding = "5px 8px";
                searchBtn.style.fontSize = "12px";
                searchBtn.style.cursor = "pointer";
                searchBtn.onclick = () => {
                    const nickname = document.querySelector(".article .name")?.innerText.trim();
                    if (nickname) {
                        window.open(`https://everytime.kr/search/all/정보/${encodeURIComponent(nickname)}`);
                    }
                };
                target.appendChild(searchBtn);
            }
        });
    }
});

// 키워드 차단: a.list 내부 <p>를 "차단됨"으로 교체 후, article.list 요소 삭제
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get((storage) => {
        const blackList = storage.bList || [];
        if (!Array.isArray(blackList) || blackList.length === 0 || blackList[0] === "") {
            return;
        }

        // 1) a.list 요소 처리: <p>를 "차단됨"으로 변경
        document.querySelectorAll("a.list").forEach((aElem) => {
            const text = aElem.innerText || "";
            for (let i = 0; i < blackList.length; i++) {
                const keyword = blackList[i].trim();
                if (!keyword) continue;
                if (text.includes(keyword)) {
                    // <p> 요소를 찾아 "차단됨"으로 변경
                    const pElem = aElem.querySelector("p");
                    if (pElem) {
                        pElem.innerText = "차단됨";
                    }
                    break;
                }
            }
        });

        // 2) article.list 요소 삭제
        document.querySelectorAll("article.list").forEach((articleElem) => {
            const text = articleElem.innerText || "";
            for (let i = 0; i < blackList.length; i++) {
                const keyword = blackList[i].trim();
                if (!keyword) continue;
                if (text.includes(keyword)) {
                    articleElem.remove();
                    break;
                }
            }
        });
    });

    // 동적 로드: 새로 추가된 노드 처리
    const observer = new MutationObserver((mutations) => {
        chrome.storage.sync.get((storage) => {
            const blackList = storage.bList || [];
            if (!Array.isArray(blackList) || blackList.length === 0 || blackList[0] === "") {
                return;
            }

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;

                    // a.list 처리
                    if (node.matches && node.matches("a.list")) {
                        const text = node.innerText || "";
                        for (let i = 0; i < blackList.length; i++) {
                            const keyword = blackList[i].trim();
                            if (!keyword) continue;
                            if (text.includes(keyword)) {
                                const pElem = node.querySelector("p");
                                if (pElem) {
                                    pElem.innerText = "차단됨";
                                }
                                break;
                            }
                        }
                    } else if (node.querySelector) {
                        node.querySelectorAll("a.list").forEach((aElem) => {
                            const text = aElem.innerText || "";
                            for (let i = 0; i < blackList.length; i++) {
                                const keyword = blackList[i].trim();
                                if (!keyword) continue;
                                if (text.includes(keyword)) {
                                    const pElem = aElem.querySelector("p");
                                    if (pElem) {
                                        pElem.innerText = "차단됨";
                                    }
                                    break;
                                }
                            }
                        });
                    }

                    // article.list 처리
                    if (node.matches && node.matches("article.list")) {
                        const text = node.innerText || "";
                        for (let i = 0; i < blackList.length; i++) {
                            const keyword = blackList[i].trim();
                            if (!keyword) continue;
                            if (text.includes(keyword)) {
                                node.remove();
                                return;
                            }
                        }
                    } else if (node.querySelector) {
                        node.querySelectorAll("article.list").forEach((articleElem) => {
                            const text = articleElem.innerText || "";
                            for (let i = 0; i < blackList.length; i++) {
                                const keyword = blackList[i].trim();
                                if (!keyword) continue;
                                if (text.includes(keyword)) {
                                    articleElem.remove();
                                    return;
                                }
                            }
                        });
                    }
                });
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
