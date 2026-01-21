
(async () => {
    // find a way to import configAccess.js here
    function storageController() {
        if (typeof browser !== "undefined" && browser.storage) {
            return browser.storage;
        }
        else if (typeof chrome !== "undefined" && chrome.storage) {
            return chrome.storage;
        }
        return null
    }

    async function currentConfig() {
        const userConfig = await new Promise((resolve) => {
            storageController().local.get(null, resolve)
        })
        return { ...defaultConfig, ...userConfig }
    }

    let defaultConfig = {
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
        language: "en",
    }


    window.addEventListener("message", async (event) => {
        if (event.data?.source === "effortless" && event.data.type === "CONFIG_SYNC" && !event.data.payload?.config) {
            const config = await currentConfig();
            console.log("Config at line 22 injector.js", config);
            window.postMessage(
                { source: "effortless", type: "CONFIG_SYNC", payload: { config } },
                "*"
            );
        }
    });

    browser.runtime.onMessage.addListener(async (message) => {
        if (message.type === "CONFIG_SYNC") {
            const config = await currentConfig();

            window.postMessage(
                { source: "effortless", type: "CONFIG_SYNC", payload: { config } },
                "*"
            );
        }
    });


    document.addEventListener("DOMContentLoaded", async () => {
        const script = document.createElement("script");
        script.id = "effortless";
        script.type = "module"
        script.src = browser.runtime.getURL("effortlesschatting.js");

        const css = document.createElement('link');
        css.id = "effortlesscss";
        css.rel = 'stylesheet';
        css.href = browser.runtime.getURL("effortlesschatting.css");

        (document.head || document.documentElement).appendChild(css);
        (document.head || document.documentElement).appendChild(script);
    });

})()