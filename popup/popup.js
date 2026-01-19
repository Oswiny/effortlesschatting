"use strict";
(async () => {

    let configManager = await import(browser.runtime.getURL("configManager.js"));
    configManager.setApis(browser, chrome)


    let labels = document.querySelectorAll("[data-label]")
    labels.forEach((element) => {
        element.textContent = configManager.labels[element.getAttribute("data-label")][element.getAttribute("data-label-type")]
    })

    function updateResetState(element, defaultValue, on) {
        const changed = JSON.stringify(defaultValue) !== JSON.stringify(on)
        element.classList.toggle("modified", changed)
    }

    async function updateVisualStates() {
        let currentConfig = await configManager.getConfig();
        let defaultConfig = await configManager.defaultConfig;
        dropdowns.forEach((item) => {
            setDropdownValue(item, currentConfig[item.id])
            updateResetState(item.closest(".row").querySelector(".reset-icon"), defaultConfig[item.id], currentConfig[item.id])
        })
        toggles.forEach((item) => {
            item.classList.toggle("on", currentConfig[item.id])
            item.setAttribute("aria-checked", currentConfig[item.id])
            updateResetState(item.closest(".row").querySelector(".reset-icon"), defaultConfig[item.id], currentConfig[item.id])
        })
        ranges.forEach((item) => {
            item.childNodes[1].value = String(currentConfig[item.childNodes[1].id])
            console.log("updated ", currentConfig[item.childNodes[1].id]);
            item.childNodes[3].textContent = item.childNodes[1].id === "scrapeSubsWithMinimumMonths" ? item.childNodes[1].value + " months" : item.childNodes[1].id === "contentNodeAmount" ? item.childNodes[1].value : item.childNodes[1].value + " ms";
            updateResetState(item.closest(".row").querySelector(".reset-icon"), defaultConfig[item.childNodes[1].id], currentConfig[item.childNodes[1].id])

        })
        arrayBasedSettings.forEach(async (item) => {
            const list = item.querySelector(".bannedList")
            await renderBanned(list, item.id)
            updateResetState(item, defaultConfig[item.id], currentConfig[item.id])
        })
    }

    function setDropdownValue(dropdown, value) {
        const hidden = dropdown.querySelector("input[type='hidden']");
        const label = dropdown.querySelector(".dropdown-label");
        const items = dropdown.querySelectorAll(".dropdown-item");

        let matchedItem = null
        items.forEach(item => {
            const isMatch = item.dataset.value === value
            item.setAttribute("aria-selected", String(isMatch))
            if(isMatch) matchedItem = item
        })

        hidden.value = value;
        label.textContent = matchedItem.textContent;
        console.log(matchedItem.textContent)
    }

    function toggleDropdown(dropdown, btn, menu, forcedState) {
        const isOpen = typeof forcedState === "boolean" ? forcedState : !dropdown.classList.contains("open");
        dropdown.classList.toggle("open", isOpen);
        btn.setAttribute("aria-expanded", String(isOpen));
        isOpen ? menu.focus() : btn.focus();
        return isOpen
    }

    const dropdowns = [...document.querySelectorAll(".dropdown")]
    dropdowns.forEach(async (dropdown) => {
        const btn = dropdown.querySelector(".dropdown-btn");
        const menu = dropdown.querySelector(".dropdown-menu");
        const label = dropdown.querySelector(".dropdown-label");
        const hidden = dropdown.querySelector("input[type='hidden']");
        const items = dropdown.querySelectorAll(".dropdown-item");
        let defaultConfig = await configManager.defaultConfig;
        let currentConfig = await configManager.getConfig()

        setDropdownValue(dropdown, currentConfig[dropdown.id])

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleDropdown(dropdown, btn, menu)
        });

        menu.addEventListener("click", (e) => {
            const item = e.target.closest(".dropdown-item");
            configManager.setConfig(dropdown.id, item.dataset.value)
            setDropdownValue(dropdown, item.dataset.value)
            updateResetState(dropdown.closest(".row").querySelector(".reset-icon"), defaultConfig[dropdown.id], hidden.value)
            toggleDropdown(dropdown, btn, menu, false);
        });


        document.addEventListener("click", () => {
            toggleDropdown(dropdown, btn, menu, false);
        });
    })

    const toggles = [...document.querySelectorAll('.toggle')];
    toggles.forEach(async (item) => {
        const id = item.id;
        const set = (on) => {
            item.classList.toggle('on', on);
            item.setAttribute('aria-checked', on);
        }
        let currentConfig = await configManager.getConfig();
        if (typeof currentConfig[id] === "boolean") {
            set(currentConfig[id])
        }
        let defaultConfig = await configManager.defaultConfig;
        item.addEventListener('click', () => {
            const isOn = item.classList.toggle('on');
            item.setAttribute('aria-checked', isOn);
            const id = item.id;
            configManager.setConfig(id, isOn)
            const reset = document.querySelector(`.reset-icon[data-target="${id}"]`);
            updateResetState(reset, defaultConfig[id], isOn)
        });
        item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } })
    });


    const ranges = [...document.querySelectorAll(".range-wrap")]
    ranges.forEach(async (item) => {
        const input = item.childNodes[1];
        const id = input.id;
        const span = item.childNodes[3];
        let currentConfig = await configManager.getConfig()
        let defaultConfig = await configManager.defaultConfig;
        console.log("config ", id, " value ", currentConfig[id]);
        input.value = String(currentConfig[id]);
        span.textContent = input.id === "scrapeSubsWithMinimumMonths" ? input.value + " months" : input.id === "contentNodeAmount" ? input.value : input.value + " ms";
        input.addEventListener("input", () => {
            configManager.setConfig(input.id, input.value)
            span.textContent = input.id === "scrapeSubsWithMinimumMonths" ? input.value + " months" : input.id === "contentNodeAmount" ? input.value : input.value + " ms";
            updateResetState(document.querySelector(`.reset-icon[data-target="${input.id}"]`), defaultConfig[input.id], input.value)
        })
    })

    let arrayBasedSettings = [...document.querySelectorAll(".subsection")]
    arrayBasedSettings.forEach(async (item) => {
        const id = item.id
        const input = item.querySelector(".bannedInput");
        const list = item.querySelector(".bannedList");
        const button = item.querySelector(".addBannedButton")

        button.addEventListener('click', async () => {
            let currentConfig = await configManager.getConfig()
            const value = input.value.trim();
            if (!value) return;
            if (currentConfig[id].includes(value)) {
                return alert('Already added!')
            };
            configManager.setConfig(id, currentConfig[id].concat([value]))
            input.value = '';
            await renderBanned(list, id);
        });

        list.addEventListener('click', async (e) => {
            let currentConfig = await configManager.getConfig()
            if (e.target.matches('button[data-index]')) {
                const i = parseInt(e.target.dataset.index);
                configManager.setConfig(id, currentConfig[id].filter((item, index) => index !== i))
                list.addEventListener('transitionend', () => item.remove(), { once: true });
                await renderBanned(list, id);
            }
        });

        await renderBanned(list, id);
    })
    async function renderBanned(list, id) {
        let currentConfig = await configManager.getConfig()
        let defaultConfig = await configManager.defaultConfig
        list.innerHTML = "";
        if (currentConfig[id].length - configManager.defaultConfig[id].length === 0) {
            const empty = document.createElement("li");
            empty.className = "muted";
            empty.textContent = "No items added yet."
            list.appendChild(empty);
            updateResetState(document.querySelector(`.reset-icon[data-target="${id}"]`), defaultConfig[id], currentConfig[id])
            return;
        }

        currentConfig[id].forEach((item, index) => {
            if (configManager.defaultConfig[id].includes(item)) {
                return;
            }
            const li = document.createElement("li");
            li.style.cssText = `
                display:flex;
                justify-content:space-between;
                align-items:center;
                padding:8px 10px;
                background:rgba(255,255,255,0.02);
                border-radius:8px;
                `;
            li.innerHTML = `
                <span>${item}</span>
                <button class="btn ghost" style="padding:4px 8px;font-size:12px;" data-index="${index}">Remove</button>
                `;
            list.appendChild(li);
        })

        currentConfig = await configManager.getConfig()
        updateResetState(document.querySelector(`.reset-icon[data-target="${id}"]`), defaultConfig[id], currentConfig[id])
        console.log("reset state updated");
    }

    document.querySelectorAll('.reset-icon').forEach(async (reset) => {
        reset.addEventListener('click', async () => {
            const id = reset.dataset.target;
            const el = document.getElementById(id);
            let defaultConfig = configManager.defaultConfig;

            if (!el) {
                return
            };
            if (!confirm('Reset this setting to default?')) {
                return
            };

            let defaultSetting = await configManager.resetConfig(id);
            reset.classList.toggle("modified", false);

            if (el.classList.contains('toggle')) {
                const on = defaultSetting;
                el.classList.toggle('on', on);
                el.setAttribute('aria-checked', on);
            }
            else if (el.type === "range") {
                el.value = String(defaultSetting);
                el.parentElement.querySelector("span").textContent = el.id === "scrapeSubsWithMinimumMonths" ? el.value + " months" : el.id === "contentNodeAmount" ? el.value : el.value + " ms";
            }
            else if (el.classList.contains("subsection")) {
                await renderBanned(el.querySelector(".bannedList"), id)
            }
            else if (el.classList.contains("dropdown")) {
                setDropdownValue(el, defaultSetting)
            }
        });
    });


    // small utility to shift hex color
    function shade(hex, percent) {
        // hex like #aabbcc
        const num = parseInt(hex.replace('#', ''), 16);
        let r = (num >> 16) + percent;
        let g = ((num >> 8) & 0x00FF) + percent;
        let b = (num & 0x0000FF) + percent;
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));
        return '#' + (r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0'));
    }

    document.getElementById('closeButton').addEventListener('click', () => {
        window.close()
    });

    document.getElementById("resetButton").addEventListener('click', async () => {
        if (!confirm('Reset settings to defaults?')) return;
        configManager.clearStorage();
        await updateVisualStates()
    });


})()
