
(async () => {
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

    const configAccessUrl = browser.runtime.getURL("configAccess.js")
    const { currentConfig } = await import(configAccessUrl)

    // carry these to configCommunicate then import and use
    window.addEventListener("message", async (event) => {
        if (event.data?.source === "effortless" && event.data.type === "CONFIG_SYNC" && !event.data.payload?.config) {
            const config = await currentConfig();
            console.log("Window listener in injector has detected a change: ", config);
            window.postMessage(
                { source: "effortless", type: "CONFIG_SYNC", payload: { config } },
                "*"
            );
        }
    });

    browser.runtime.onMessage.addListener(async (message) => {
        if (message.type === "CONFIG_SYNC") {
            const config = await currentConfig();
            console.log("OnMessage listener in injector has detected a change: ", config)
            window.postMessage(
                { source: "effortless", type: "CONFIG_SYNC", payload: { config } },
                "*"
            );
        }
    });




})()