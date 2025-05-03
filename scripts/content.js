const observer = new MutationObserver((mutations, observer) => {
    const logoImg = document.querySelector("nav #logo a img");

    if (logoImg) {
        console.log("test complete");
        logoImg.src = chrome.runtime.getURL("icons/dku_main_logo.png");

        fetch('https://everytime.kr/timetable', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'User-Agent': navigator.userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
                'Accept-Language': 'ko-KR,ko;q=0.9',
                'Referer': 'https://everytime.kr/',}
    }).then(response => console.log(response.text()));

        observer.disconnect();
    }
})

observer.observe(document.body, {
    childList: true,
    subtree: true
})