function handleMessage(request, sender, sendResponse) {
	if (sender.url != browser.runtime.getURL("/devtools/panel.html")) {
		return;
	}

	if (request.type === "js")
		browser.tabs.executeScript(request.tabId, request.script);

	if (request.type === "css")
		browser.tabs.insertCSS(request.tabId, request.script);
}

browser.runtime.onMessage.addListener(handleMessage);
