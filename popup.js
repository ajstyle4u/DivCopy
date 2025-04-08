document.addEventListener("DOMContentLoaded", async function () {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
        console.error("No active tab found.");
        return;
    }

    document.getElementById("yourButtonID").addEventListener("click", function () {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        }).catch(error => console.error("Script execution failed:", error));
    });
});
