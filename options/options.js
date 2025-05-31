let saveButton = document.getElementById("saveAndRefresh");

chrome.storage.sync.get((storage) => {
    document.getElementById("makeSearchButton").checked = storage.makeSearchButton;
    document.getElementById("makeAnonyButton").checked = storage.setAnony;
    document.getElementById("blacklist").value = storage.bList ? storage.bList : "";
    
});

saveButton.addEventListener('click', () => {
    saveOptions();
});

async function saveOptions() {
    let blackList = document.getElementById("blacklist").value.split(",");
    //console.log(blackList);
    const index = blackList.indexOf("");
    let i = 0;
    while (i < blackList.length) {
        if (blackList[i] === "") {
            blackList.splice(i, 1);
        } 
        else {
            ++i;
        }
    }
    chrome.storage.sync.set({
        makeSearchButton: document.getElementById("makeSearchButton").checked,
        setAnony: document.getElementById("makeAnonyButton").checked,
        bList: blackList
    });
    let currentTabUrl = await getCurrentTabUrl();
}