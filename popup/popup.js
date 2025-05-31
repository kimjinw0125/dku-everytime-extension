document.querySelector(".right > a").addEventListener("click", function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: this.href });
});

document.querySelector(".option-button").addEventListener("click", function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});