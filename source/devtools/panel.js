import optionsStorage from "../options-storage";

optionsStorage.syncForm("#options-form");

const inject = () => {
	browser.runtime.sendMessage({
		tabId: browser.devtools.inspectedWindow.tabId,
		type: "js",
		script: { file: "/content_scripts/overlay.js" }
	});

	browser.runtime.sendMessage({
		tabId: browser.devtools.inspectedWindow.tabId,
		type: "css",
		script: { file: "/content_scripts/overlay.css" }
	});
};

inject();
