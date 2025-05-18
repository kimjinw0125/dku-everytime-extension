// 로고 바꾸기 
const observer = new MutationObserver((mutations, obs) => {
  const logoImg = document.querySelector("nav #logo a img");
  if (logoImg) {
    console.log("✅ 로고 교체 완료");
    logoImg.src = chrome.runtime.getURL("icons/dku_main_logo.png");
    obs.disconnect();
  }
});

(function adBlocker() {
  const adSelectors = [
    '[id^="ad-"]',         
    '[class*="ad-"]',     
    '.ad', '.ads',        
    '.banner', '.banner-ad',
    '#sponsor', '.sponsor',
    'iframe[src*="ads"]'
  ];

  
  function removeAds(root = document) {
    adSelectors.forEach(sel => {
      root.querySelectorAll(sel).forEach(el => el.remove());
    });
  }


  removeAds();

  new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          removeAds(node);
        });
      }
    });
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
})();


observer.observe(document.body, {
  childList: true,
  subtree: true
});


(async function() {
  
  function waitFor(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const mo = new MutationObserver((_, o) => {
        const found = document.querySelector(selector);
        if (found) {
          o.disconnect();
          resolve(found);
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        mo.disconnect();
        reject(new Error(`Timeout waiting for ${selector}`));
      }, timeout);
    });
  }

  
  let rightside;
  try {
    rightside = await waitFor('div.rightside');
  } catch (e) {
    console.error("❌ div.rightside가 없습니다.", e);
    return;
  }

  
  const iframe = document.createElement('iframe');
  iframe.src = 'https://everytime.kr/timetable';
  Object.assign(iframe.style, {
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    width: '1px',
    height: '1px',
    border: 'none'
  });
  document.body.appendChild(iframe);

 
  iframe.onload = () => {
    const doc = iframe.contentDocument;
    const interval = setInterval(() => {
      const tb = doc.querySelector('div.tablebody');
      if (tb && tb.children.length > 0) {
        clearInterval(interval);

      
        rightside.innerHTML = '';
        const clone = document.importNode(tb, true);
        rightside.appendChild(clone);

        rightside.style.position = 'relative';
        rightside.style.zIndex   = '10';
        clone.style.width        = '100%';
        clone.style.maxWidth     = 'none';
        clone.style.margin       = '0';

        iframe.remove();
        console.log('✅ rightside에 tablebody 삽입 완료');

        rightside.querySelectorAll('div.time').forEach(el => {

        const text = el.textContent.trim();
 
        const lines = text.split(/\s+/).join('<br>');

        el.innerHTML = lines;
        });

                


       const timesContainer = rightside.querySelector('.times');
        if (timesContainer) {
        Array.from(timesContainer.querySelectorAll('.time'))
            .slice(0, 9)    
            .forEach(el => el.remove());
        }
        const cols = rightside.querySelectorAll('div.cols');
        (() => {
            const subjects = Array.from(rightside.querySelectorAll('div.subject'));
            const groupSet = new Set();

         
            subjects.forEach(el => {
                for (const c of el.classList) {
                if (/^color\d+$/.test(c)) {
                    groupSet.add(c);
                    break;
                }
                }
            });
            const groups = Array.from(groupSet);
            const gCount = groups.length;

      
            const groupColors = {};
            groups.forEach((grp, i) => {
              
                const hue = Math.round(i * 360 / gCount);
                groupColors[grp] = `hsl(${hue},60%,85%)`;
            });

            subjects.forEach(el => {
                const grp = Array.from(el.classList).find(c => /^color\d+$/.test(c));
                if (!grp) return;
                el.style.backgroundColor = groupColors[grp];
                el.style.color           = '#000';
            });

            console.log('🎨 균등 분포 색 적용 완료', groupColors);
            })();
    }
    }, 200);
  };
})();
