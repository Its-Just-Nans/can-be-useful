chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(null, {
        code: "alert(document.querySelector('p').innerText)",
    });
});
