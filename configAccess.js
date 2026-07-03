//used by files who already have access to browser or chrome APIs
import { defaultConfig, getDefaultConfig } from "./config.js";

export function storageController() {
    if (typeof browser !== "undefined" && browser.storage) {
        return browser.storage;
    }
    else if (typeof chrome !== "undefined" && chrome.storage) {
        return chrome.storage;
    }
    return null
}

export async function currentConfig() {
    const userConfig = await new Promise((resolve) => {
        storageController().local.get(null, resolve)
    })
    return { ...getDefaultConfig(), ...userConfig }
}

export async function setConfig(rootKey, value, access = null) {
    const currentRoot = await new Promise((resolve) => {
        storageController().local.get([rootKey], (result) => {
            resolve(result[rootKey] || {});
        });
    });

    if (!access) {
        await new Promise((resolve) => {
            storageController().local.set({ [rootKey]: value }, resolve);
        });
        await sendUpdateConfigMessage();
        return;
    }

    const pathSegments = access.split(".");
    const finalKey = pathSegments.pop();

    let parentTarget = currentRoot;
    for (const segment of pathSegments) {
        if (typeof parentTarget[segment] !== 'object' || parentTarget[segment] === null) {
            parentTarget[segment] = {};
        }
        parentTarget = parentTarget[segment];
    }

    parentTarget[finalKey] = value;

    await new Promise((resolve) => {
        storageController().local.set({ [rootKey]: currentRoot }, resolve);
    });
    console.log(await currentConfig())
    await sendUpdateConfigMessage();
}

export async function setBulkConfig(object) {
    await new Promise((resolve) => {
        storageController().local.set(object, resolve)
    })
    await sendUpdateConfigMessage();
}
export async function resetConfig(key) {
    await new Promise((resolve) => {
        storageController().local.set({ [key]: defaultConfig[key] }, resolve)
    })
    await sendUpdateConfigMessage()
    return defaultConfig[key];
}

export async function updateConfig() {
    const config = await currentConfig();
    window.postMessage({ source: "effortless", type: "CONFIG_SYNC", payload: { config } }, "*");
}

export async function sendUpdateConfigMessage() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const twitchRegex = /^https:\/\/www\.twitch\.tv\//;
    if (!tab || !tab.url || !twitchRegex.test(tab.url)) return;
    await browser.tabs.sendMessage(tab.id, { type: "CONFIG_SYNC" });
}

export async function clearStorage() {
    storageController().local.clear()
    await sendUpdateConfigMessage()
}
