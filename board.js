const obs0 = new MutationObserver((mutations, observer) => {
    let currentUrl = window.location.href;
    let boardId = currentUrl.substring(21);
    chrome.storage.sync.get((storage) => {
        let blackList = storage.bList;
        //console.log(blackList);
        if (blackList.length > 0 && blackList[0] !== "") {
            if (currentUrl == "https://everytime.kr/") {
                mutations.forEach((mutation) => {
                    processHome(mutation, blackList);
                    processRightSide(mutation, blackList);
                });
            }
            else if (!isNaN(boardId) || boardId.charAt(7) == "p") {
                mutations.forEach((mutation) => {
                    processBoard(mutation, blackList);
                    processRightSide(mutation, blackList);
                    setAnony(mutation);
                });
            }
            else if (boardId.substring(0, 10) == "hotarticle") {
                mutations.forEach((mutation) => {
                    processHotArticle(mutation, blackList);
                    processRightSide(mutation, blackList);
                });
            }
        }
        
        if (storage.setAnony) {
            mutations.forEach((mutation) => {
                setAnony(mutation);
            });
        }
        
    });
});

document.addEventListener('DOMContentLoaded', () => {
    obs0.observe(document.body, { childList: true, subtree: true });
});

function setAnony(mutation) {
    if (mutation.addedNodes && mutation.target.classList.value == "option") {
        mutation.addedNodes.forEach((element) => {
            if (element.classList.value == "anonym") {
                element.classList.value = "anonym active";
            }
        });
    }
    else if (mutation.addedNodes && (mutation.target.classList.value == "writecomment" || mutation.target.classList.value == "comments")) {
        mutation.addedNodes.forEach((element) => {
            //console.log("writecomment");
            if (element.classList.value == "option") {
                element.childNodes[0].classList.value == "anonym active";
                //console.log("set anony");
            }
            else if (element.classList.value == "writecomment child") {
                element.childNodes[1].classList.value == "anonym active";
                //console.log("set anony");
            }
        });
    }
}

function processRightSide(mutation, blackList) {
    let title;
    let preview;
    
    if (mutation.addedNodes && mutation.target.classList.value == "rightside") {
        mutation.addedNodes.forEach((element) => {
            if (element.classList.value == "card") {
                if (element.childNodes[0].childNodes[0].childNodes[0].innerText == "실시간 인기 글") {
                    if (element.childNodes[0].childNodes[1].childNodes[0].classList.value == "title") {
                        title = element.childNodes[0].childNodes[1].childNodes[0].innerText.split(" ");
                        preview = element.childNodes[0].childNodes[1].childNodes[1].innerText.split(/\n| /);
                        title.forEach((word) => {
                            if (blackList.some(keyword => word.includes(keyword))) {
                                element.childNodes[0].childNodes[1].childNodes[0].innerText = "차단됨";
                                element.childNodes[0].childNodes[1].childNodes[1].innerText = "차단됨";
                            }
                        });

                        preview.forEach((word) => {
                            if (blackList.some(keyword => word.includes(keyword))) {
                                element.childNodes[0].childNodes[1].childNodes[0].innerText = "차단됨";
                                element.childNodes[0].childNodes[1].childNodes[1].innerText = "차단됨";
                            }
                        });
                    }
                    else {
                        preview = element.childNodes[0].childNodes[1].childNodes[0].innerText.split(/\n| /);
                        preview.forEach((word) => {
                            if (blackList.some(keyword => word.includes(keyword))) {
                                element.childNodes[0].childNodes[1].childNodes[0].innerText = "차단됨";
                            }
                        });
                    }

                    if (element.childNodes[0].childNodes[2].childNodes[0].classList.value == "title") {
                        console.log("title");
                        title = element.childNodes[0].childNodes[2].childNodes[0].innerText.split(" ");
                        preview = element.childNodes[0].childNodes[2].childNodes[1].innerText.split(/\n| /);
    
                        title.forEach((word) => {
                            if (blackList.some(keyword => word.includes(keyword))) {
                                element.childNodes[0].childNodes[2].childNodes[0].innerText = "차단됨";
                                element.childNodes[0].childNodes[2].childNodes[1].innerText = "차단됨";
                            }
                        });
    
                        preview.forEach((word) => {
                            if (blackList.some(keyword => word.includes(keyword))) {
                                element.childNodes[0].childNodes[2].childNodes[0].innerText = "차단됨";
                                element.childNodes[0].childNodes[2].childNodes[1].innerText = "차단됨";
                            }
                        });
                    }
                    else {
                        preview = element.childNodes[0].childNodes[2].childNodes[0].innerText.split(/\n| /);
                        preview.forEach((word) => {
                            if (blackList.some(keyword => word.includes(keyword))) {
                                element.childNodes[0].childNodes[2].childNodes[0].innerText = "차단됨";
                            }
                        });
                    }
                }
                else if (element.childNodes[0].childNodes[0].childNodes[0].innerText == "HOT 게시물\n더 보기") {
                    articleList = element.childNodes[0].childNodes;
                    articleList.forEach((node) => {
                        if (node.classList.value == "list") {
                            title = node.childNodes[1].innerText.split(" ");
                            title.forEach((word) => {
                                if (blackList.some(keyword => word.includes(keyword))) {
                                    node.childNodes[1].innerText = "차단됨";
                                }
                            });
                        }
                    });
                }  
            }
        });
    }
}

function processHotArticle(mutation, blackList) {
    let title;
    let preview;
    
    if (mutation.addedNodes && mutation.target.classList.value == "wrap articles") {
        mutation.addedNodes.forEach((element) => {
            if (element.tagName == "ARTICLE") {
                if (element.querySelector("h2")) {
                    title = element.querySelector("h2").innerText.split(" ");
                    preview = element.childNodes[0].childNodes[5].innerText.split(/\n| /);
                    title.forEach((word) => {
                        if (blackList.some(keyword => word.includes(keyword))) {
                            element.querySelector("h2").innerText = "차단됨";
                            element.childNodes[0].childNodes[5].innerText = "차단됨";
                        }
                    });

                    preview.forEach((word) => {
                        if (blackList.some(keyword => word.includes(keyword))) {
                            element.querySelector("h2").innerText = "차단됨";
                            element.childNodes[0].childNodes[5].innerText = "차단됨";
                        }
                    });
                }
                else if (element.childNodes[0].childNodes[4].tagName == "P") {
                    preview = element.childNodes[0].childNodes[4].innerText.split(/\n| /);
                    preview.forEach((word) => {
                        if (blackList.some(keyword => word.includes(keyword))) {
                            element.childNodes[0].childNodes[4].innerText = "차단됨";
                        }
                    });
                }
            }
        });
    }
}

function processHome(mutation, blackList) {
    let preview;

    if (mutation.addedNodes && mutation.target.classList.value == "main") {
        mutation.addedNodes.forEach((element) => {
            if (element.classList.value == "card") {
                element.childNodes[0].childNodes.forEach((node) => {
                    if (node.classList.value == "list") {
                        preview = node.childNodes[1].innerText.split(/\n| /);
                        preview.forEach((word) => {
                            if (blackList.some(keyword => word.includes(keyword))) {
                                node.childNodes[1].innerText = "차단됨";
                            }
                        });
                    }
                    else if (node.classList.value == "article") {
                        preview = node.childNodes[0].innerText.split(/\n| /);
                        preview.forEach((word) => {
                            if (blackList.some(keyword => word.includes(keyword))) {
                                node.childNodes[0].innerText = "차단됨";
                            }
                        });
                    }
                });
            }
        });
    }
}

function processBoard(mutation, blackList) {
    let title;
    let preview;

    if (mutation.addedNodes && mutation.target.classList.value == "wrap articles") {
        mutation.addedNodes.forEach((element) => {
            if (element.tagName == "ARTICLE") {
                if (element.querySelector("h2")) {
                    title = element.querySelector("h2").innerText.split(" ");
                    preview = element.getElementsByClassName("small")[0].innerText.split(/\n| /);

                    title.forEach((word) => {
                        if (blackList.some(keyword => word.includes(keyword))) {
                            element.querySelector("h2").innerText = "차단됨";
                            element.getElementsByClassName("small")[0].innerText = "차단됨";
                        }
                    });

                    preview.forEach((word) => {
                        if (blackList.some(keyword => word.includes(keyword))) {
                            element.querySelector("h2").innerText = "차단됨";
                            element.getElementsByClassName("small")[0].innerText = "차단됨";
                        }
                    });
                }
                else if (element.childNodes[0].childNodes[4].tagName == "P") {
                    preview = element.childNodes[0].childNodes[4].innerText.split(/\n| /);
                    preview.forEach((word) => {
                        if (blackList.some(keyword => word.includes(keyword))) {
                            element.childNodes[0].childNodes[4].innerText = "차단됨";
                        }
                    });
                }
                else if (element.childNodes[0].childNodes[5].tagName == "P") {
                    preview = element.childNodes[0].childNodes[5].innerText.split(/\n| /);
                    preview.forEach((word) => {
                        if (blackList.some(keyword => word.includes(keyword))) {
                            element.childNodes[0].childNodes[5].innerText = "차단됨";
                        }
                    });
                }
            }
        });
    }
}