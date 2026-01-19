export let defaultConfig = {
    useStartAsDefaultOffset: false,
    get defaultOffsetPosition() { return defaultConfig.useStartAsDefaultOffset ? "start" : "end" },
    autoSpace: true,
    allowText: true,
    deleteAfterMs: 10000,
    contentNodeAmount: 5,
    bannedWords: ["\n", "", "͏", "​", "‌", "‍", "﻿", "͏", "⁠", "⁣", "⁢", "⁤", "", "", "", "", "", "", "", "", "", "", ""],
    bannedEmotes: [],
    bannedUsers: [],
    scrapeBots: false,
    scrapeMods: false,
    scrapeVIPs: true,
    scrapeOnlySubs: false,
    scrapeSubsWithMinimumMonths: 12,
    updateNodesAfterTimeout: false,
    autoHide: false,
    scrapeAlreadySentMessages: true,
    requiredHoldTime: 5000,
    messageClickAnimationTime: 125,
    scannerMethod: "injection-with-emotes",
}

export const labels = {
    scannerMethod: {
        main: "Scanner Method",
        alt: "Choose what to use to scan and detect incoming messages"
    },
    addButton: {
        main: "Add"
    },
    resetButton: {
        main: "Reset All"
    },
    setMessageBox: {
        main: "Message Box Settings",
        alt: "Change how the message boxes behave",
    },
    setInsert: {
        main: "Insert settings",
        alt: "Adjust how inserter behaves",
    },
    mainTag: {
        main: "Effortless Chatting",
        alt: "Settings",
    },
    setScanner: {
        main: "Scanner setting ",
        alt: "Adjust how scanner behaves",
    },
    useStartAsDefaultOffset: {
        main: "Default Insert Position",
        alt: "Whether to insert a message to start or end if no cursor is available",
    },
    autoSpace: {
        main: "Automatic Space",
        alt: "Automatically put spaces when inserting a message",
    },
    allowText: {
        main: "Allow Text",
        alt: "Allow scanning of text messages",
    },
    deleteAfterMs: {
        main: "Message Lifespan",
        alt: "Time a scanned message is alive for",
    },
    contentNodeAmount: {
        main: "Message Box Amount",
        alt: "Amount of message boxes displayed",
    },
    bannedWords: {
        main: "Blocked Words",
        alt: "These words will be ignored by the scanner",
    },
    bannedEmotes: {
        main: "Blocked Emotes",
        alt: "These emotes will be ignored by the scanner",
    },
    bannedUsers: {
        main: "Blocked Users",
        alt: "These users's messages will be ignored by the scanner",
    },
    scrapeBots: {
        main: "Allow Bots",
        alt: "Allow scanning messages of bots",
    },
    scrapeMods: {
        main: "Allow Mods",
        alt: "Allow scanning messages of moderators",
    },
    scrapeVIPs: {
        main: "Allow VIPs",
        alt: "Allow scanning messages of vips",
    },
    scrapeOnlySubs: {
        main: "Allow Only Subscribers",
        alt: "Allow scanning only messages of subscribed users",
    },
    scrapeSubsWithMinimumMonths: {
        main: "Minimum Subscribed Month Requirement",
        alt: "Scans only users whom have been subscribed for at least selected amount of months",
    },
    updateNodesAfterTimeout: {
        main: "Refresh Message Boxes After Lifespan Ends",
        alt: "Refreshes message boxes after lifespan of a message ends",
    },
    autoHide: {
        main: "Automatic Hide",
        alt: "Automatically hide extension panel when no messages are available",
    },
    scrapeAlreadySentMessages: {
        main: "Scan Sent Messages",
        alt: "Starts scanning from the messages shown",
    },
    requiredHoldTime: {
        main: "Hold Time For Automatic Send",
        alt: "Sends message after being held this much time on a message box",
    },
    messageClickAnimationTime: {
        main: "Animation Length For Click",
        alt: "Time animation plays out when a message box has been clicked on",
    },
}

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
let storage
let browser;
let chrome;
export async function setApis(pBrowser, pChrome) {
    browser = pBrowser;
    chrome = pChrome;
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

/*
async function getCurrentConfig() {
    return Config;
}
*/