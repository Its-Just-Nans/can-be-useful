const urls = {
    yolo: new Set(),
};

let domain = "";

const getDomain = () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            try {
                domain = new URL(tabs[0].url).hostname;
                if (!urls[domain]) {
                    urls[domain] = new Set();
                }
            } catch (e) {}
        }
    });
};

getDomain();
function logURL(requestDetails) {
    const contentType = requestDetails.responseHeaders.find((oneHeader) => {
        return oneHeader.name.toLowerCase() === "content-type";
    });
    if (contentType?.value.toLowerCase().includes("application/json")) {
        getDomain();
        try {
            const urlRequest = new URL(requestDetails.url);
            const url = urlRequest.href.replace(urlRequest.searchParams.toString(), "");
            urls[domain].add(url);
            if (port) {
                port.postMessage(Object.entries(urls[domain]));
            }
        } catch (e) {}
    }
}

chrome.webRequest.onCompleted.addListener(
    logURL,
    {
        urls: ["https://*/*"],
    },
    ["responseHeaders"]
);

let port = null;
chrome.runtime.onConnect.addListener(function (p) {
    port = p;
    port.postMessage(urls[domain]);
});
