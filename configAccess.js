//used by files who already have access to browser or chrome APIs
import { defaultConfig } from "./config.js";

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
    return { ...defaultConfig, ...userConfig }
}

export async function setConfig(key, value) {
    await new Promise((resolve) => {
        storageController().local.set({ [key]: value }, resolve)
    })
    await sendUpdateConfigMessage()
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
    await browser.tabs.sendMessage(tab.id, { type: "CONFIG_SYNC" });
}

export function clearStorage() {
    storageController().local.clear()
}
