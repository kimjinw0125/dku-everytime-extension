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

        const iframe = document.createElement('iframe');
        iframe.src = 'https://everytime.kr/timetable';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        iframe.onload = () => {
            try {
                setTimeout(() => {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const timetable = doc.body.querySelectorAll("div.wrap")[1];
                    console.log(doc.body);
                    console.log(timetable);
                    document.body.appendChild(timetable);
                }, 2000);
            } 
            catch (err) {
                console.error('iframe 접근 실패:', err);
            }
        }


        observer.disconnect();
    }
})

observer.observe(document.body, {
    childList: true,
    subtree: true
})