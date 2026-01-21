function getStorageController() {
    if (typeof browser !== "undefined" && browser.storage) {
        return browser.storage;
    }
    else if (typeof chrome !== "undefined" && chrome.storage) {
        return chrome.storage;
    }
    return null
}

export async function getConfig() {
    storage = getStorageController();

    let userConfig = await new Promise((resolve) => {
        storage.local.get(null, resolve)
    })
    console.log("currentConfig ", { ...defaultConfig, ...userConfig })
    return { ...defaultConfig, ...userConfig };
}

export async function updateConfig() {
    Config = await getConfig()
    sendUpdateConfig();
}


export let storage;
let browser;
let chrome;
export async function setApis(pBrowser, pChrome) {
    /*
    browser = pBrowser;
    chrome = pChrome;
    */
    getStorageController();
    await updateConfig();
}

export function printApis() {
    console.log(browser, chrome);
}

export async function setConfig(key, value) {
    await new Promise((resolve) => {
        storage.local.set({ [key]: value }, resolve)
    })
    await updateConfig()
}

export async function resetConfig(key) {
    await new Promise((resolve) => {
        storage.local.set({ [key]: defaultConfig[key] }, resolve)
    })
    await updateConfig()
    return defaultConfig[key];
}

export function clearStorage() {
    storage.local.clear()
}


export let Config;

export function getCurrentConfig() {
    return Config;
}

export async function requestConfig() {
    return new Promise((resolve) => {
        window.postMessage({ type: "getConfig" }, "*");
        function handleIncomingEvent(event) {
            if (event.data.effortless) {
                window.removeEventListener("message", handleIncomingEvent)
                resolve(event.data.config)
            }
        }
        window.addEventListener("message", handleIncomingEvent)
    })
}

export async function sendUpdateConfig() {
    window.postMessage({ "effortless": true, "type": "updateConfig", "config": Config }, "*")
}

export async function requestLabelUpdate() {
    return new Promise((resolve) => {
        const requestId = crypto.randomUUID();

        function onMsg(event) {
            if (event.data.effortless && event.data.type === "labelUpdateDone") {
                window.removeEventListener("message", onMsg)
                resolve()
            }
        }

        window.addEventListener("message", onMsg)
        window.postMessage({ "effortless": true, "type": "requestLabelUpdate", "requestId": requestId }, "*")
    })
}

browser.runtime.onMessage.addListener((message) => {
    if (message.type !== "requestLabelUpdate") return;

    window.postMessage(
        { effortless: true, type: "requestLabelUpdate" },
        "*"
    );
});


/*
async function getCurrentConfig() {
    return Config;
}
*/