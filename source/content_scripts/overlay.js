import CableReady from "cable_ready";
import optionsStorage from "../options-storage";

let injected;

const dasherize = string => {
	return string.replace(/[A-Z]/g, function(char, index) {
		return (index !== 0 ? "-" : "") + char.toLowerCase();
	});
};

const intercept = async ({ detail, target, type }) => {
	const { overlay, duration } = await optionsStorage.getAll();

	if (target !== document && overlay) {
		const body = target === document.body;
		const style = getComputedStyle(target);
		const border = style.getPropertyValue("border");
		const title = document.createElement("div");
		const overlay = document.createElement("div");
		const eventType = type.split("after-")[1];
		const color = eventType === "morph" ? "#FF9800" : "#0F0";
		const d = detail.stimulusReflex;
		const titleTarget = (d && d.target) || "";
		const reflexId = (d && d.reflexId) || "";

		setTimeout(() => {
			const t_rect = target.getBoundingClientRect();
			const rect = body ? { top: 56, left: 0 } : t_rect;
			const titleTop = rect.top - 56 + Math.round(scrollY);
			const oTop = body ? 0 : t_rect.top + Math.round(scrollY);

			title.style.cssText = `top:${titleTop}px;left:${rect.left}px;`;
			title.classList.add("title", "fade");
			title.innerHTML = `${eventType} <b>${titleTarget}</b> \u2192 ${detail.selector}<br><small>${reflexId}</small>`;

			overlay.style.cssText = `top:${oTop}px;left:${t_rect.left}px;width:${t_rect.width}px;height:${t_rect.height}px;background-color: ${color};transition-duration: ${duration}ms`;
			overlay.classList.add("overlay", "fade");
			overlay.style.border = border;

			document.body.appendChild(title);
			document.body.appendChild(overlay);
		});

		setTimeout(() => {
			title.classList.add("fadeout");
			overlay.classList.add("fadeout");

			setTimeout(() => {
				title.remove();
				overlay.remove();
			}, duration);
		}, 100);
	}
};

const operations = Object.keys(CableReady.DOMOperations).map(key =>
	dasherize(key)
);

const attachCableReadyListeners = () => {
	operations.forEach(operation =>
		document.addEventListener(`cable-ready:after-${operation}`, intercept)
	);
};

// from https://github.com/openstyles/stylus/blob/0c8e69fb/content/install-hook-openusercss.js#L149-L168
const orphanCheck = () => {
	// const eventName = browser.runtime.id + "-cable-ready-install-hook";
	// const orphanCheckRequest = () => {
	// 	// If we can't get the UI language, it means we are orphaned, and should
	// 	// remove our event handlers
	// 	if (browser.i18n && chrome.i18n.getUILanguage()) return true;
	// 	operations.forEach(operation =>
	// 		document.removeEventListener(`cable-ready:after-${operation}`, intercept)
	// 	);
	// 	document.removeEventListener(eventName, orphanCheckRequest, true);
	// };
	// Send the event before we listen for it, for other possible
	// running instances of the content script.
	// dispatchEvent(new Event(eventName));
	// addEventListener(eventName, orphanCheckRequest, true);
};

(async function init() {
	if (!injected) {
		injected = true;

		// 	orphanCheck();
		attachCableReadyListeners();
	}
})();
