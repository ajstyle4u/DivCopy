chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "copyElement",
        title: "Copy Element HTML & CSS",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copyElement") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                let target = document.activeElement;
                if (!target) return;

                let html = target.outerHTML;
                let computedStyles = window.getComputedStyle(target);
                let css = "";
                for (let prop of computedStyles) {
                    css += `${prop}: ${computedStyles.getPropertyValue(prop)};\n`;
                }

                navigator.clipboard.writeText(`HTML:\n${html}\n\nCSS:\n${css}`)
                    .then(() => alert("Element copied via right-click!"))
                    .catch(err => console.error("Copy failed:", err));
            }
        });
    }
});
