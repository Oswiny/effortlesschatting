//used by files who do NOT have direct access to browser or chrome APIs
export function requestConfig() {
    window.postMessage({ source: "effortless", type: "REQUEST_CONFIG" }, "*");
}

/*
browser.runtime.onMessage.addListener(async (event) => {
    if (event.data.source === "effortless" && event.data.type === "REQUEST_CONFIG") {
        const currentConfig = currentConfig()
        window.postMessage({source: "effortless", type: "CONFIG_UPDATE", payload: currentConfig})
    }
});
*/


