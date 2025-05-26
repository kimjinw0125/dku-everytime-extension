const obs1 = new MutationObserver((mutations, observer) => {
    chrome.storage.sync.get((storage) => {
        if(!storage.makeSearchButton) {
            obs1.disconnect();
            //console.log("observer disconnected");
        } 
        else {
            requestIdleCallback(() => {
                if (mutations && document.getElementsByClassName("type type0")[0]) {
                    makeSearchButton(obs1);
                }
            }, { timeout: 1000});
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    obs1.observe(document.body, {childList: true, subtree: true});
});

function getMsgStr() {
    let notice = document.getElementsByClassName("type type0")[0];
    let msgstr = null;
    if (notice) {
        msgstr = notice.nextSibling.innerText;
    }
    msgstr = msgstr.substring(msgstr.indexOf("글 내용:")+6);
    msgstr = msgstr.replace(/\n/g, " ");
    return msgstr;
}

function makeSearchButton(obs) {
    obs.disconnect();
    if (!document.getElementById("searchButton")) {
        let notice = document.getElementsByClassName("type type0")[0];
        let parentOfNotice = notice.parentNode; 
        let searchButton = document.createElement('button');
        searchButton.innerText = "쪽지가 시작된 글 찾기";
        searchButton.id = "searchButton";
        parentOfNotice.insertBefore(searchButton, notice);
        searchButton.addEventListener('click', () => {
        openNewTabAndSearch(getMsgStr());
    });
    }
    obs.observe(document.body, {childList: true, subtree: true});
}

function openNewTabAndSearch(msgString) {
    window.open("https://everytime.kr/search/all/"+msgString);
}