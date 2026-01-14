(async () => {
    let configManager;

    window.addEventListener("message", (event) => {
        if (event.data.type === "getConfig") {
            let config = configManager.Config;
            window.postMessage({ "effortless": true, "config": config }, "*")
        }
    })

    document.addEventListener("DOMContentLoaded", async () => {
        const script = document.createElement("script");
        script.id = "effortless";
        script.type = "module"
        configManager = await import(browser.runtime.getURL("configManager.js"));
        await configManager.setApis(browser, chrome);
        script.src = browser.runtime.getURL("effortlesschatting.js");

        const css = document.createElement('link');
        css.id = "effortlesscss";
        css.rel = 'stylesheet';
        css.href = browser.runtime.getURL("effortlesschatting.css");
        
        (document.head || document.documentElement).appendChild(css);
        (document.head || document.documentElement).appendChild(script);
    });


    window.addEventListener("keydown", async (event) => {
        if (event.key.toUpperCase() === "K") {
            configManager.printApis()
            await configManager.resetConfig(Object.keys(configManager.defaultConfig)[0])
        }
    })
})()