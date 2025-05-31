import { reloadTab, initContentFunction } from "./utils.js";


chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "setting-changed") {
        reloadTab();
    }
})