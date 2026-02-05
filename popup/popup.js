"use strict";
import * as configAccess from "../configAccess.js";
import { defaultConfig, labels } from "../config.js";

(async () => {
    let currentConfig = await configAccess.currentConfig();
    async function updateLabels(language) {
        const labelElements = document.querySelectorAll("[data-label]")
        labelElements.forEach((element) => {
            if (element.hasAttribute("placeholder")) (element.placeholder = labels[language][element.getAttribute("data-label")][element.getAttribute("data-label-type")]);
            else if (element.getAttribute("data-label") === "reset-icon") (element.setAttribute("title", labels[language]["reset-icon"]["main"]))
            else element.textContent = labels[language][element.getAttribute("data-label")][element.getAttribute("data-label-type")]
        })
    }
    updateLabels(currentConfig["language"])

    async function updateStatusDots() {
        //might just scrape this.
        const twitchPill = document.querySelector("#twitch.status-pill")
        const twitchDot = twitchPill.querySelector(".status-dot")
        /*
        const seventvPill = document.querySelector("#seventv.status-pill")
        const seventvDot = seventvPill.querySelector(".status-dot")
        */
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        const isOnTwitch = /^https?:\/\/(www\.)?twitch\.tv(\/.*)?$/i.test(tab.url);
        const colors = ["green", "red"]
        //const dots = [twitchDot, seventvDot]
        const dots = [twitchDot]
        dots.forEach(statusDot => colors.forEach(color => statusDot.classList.toggle(color, false)))
        if (isOnTwitch) {
            twitchDot.classList.toggle("green", true)
        }
        else {
            twitchDot.classList.toggle("red", true)
        }
    }
    await updateStatusDots()

    function updateResetState(element, defaultValue, on) {
        const changed = JSON.stringify(defaultValue) !== JSON.stringify(on)
        element.classList.toggle("modified", changed)
        const section = element.closest("section.card.section")
        const sectionResetIcon = section.querySelector(".heading-row .reset-icon")
        const selfCount = sectionResetIcon.classList.contains("modified") ? 1 : 0
        const isAnyModified = section.querySelectorAll(".modified").length - selfCount > 0
        sectionResetIcon.classList.toggle("modified", isAnyModified)
    }

    async function updateVisualStates() {
        let currentConfig = await configAccess.currentConfig();
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
            item.childNodes[3].textContent = item.childNodes[1].value;
            updateResetState(item.closest(".row").querySelector(".reset-icon"), defaultConfig[item.childNodes[1].id], currentConfig[item.childNodes[1].id])

        })
        arrayBasedSettings.forEach(async (item) => {
            const list = item.querySelector(".banned-list")
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
            if (isMatch) matchedItem = item
        })


        hidden.value = value;
        label.textContent = matchedItem.textContent;
        if (!(dropdown.id === "language")) label.setAttribute("data-label", value)
    }

    function toggleDropdown(dropdown, btn, menu, forcedState) {
        const isOpen = typeof forcedState === "boolean" ? forcedState : !dropdown.classList.contains("open");
        dropdown.classList.toggle("open", isOpen);
        btn.setAttribute("aria-expanded", String(isOpen));
        isOpen ? menu.focus({ preventScroll: true }) : btn.focus({ preventScroll: true });
        return isOpen
    }

    const dropdowns = [...document.querySelectorAll(".dropdown")]
    dropdowns.forEach(async (dropdown) => {
        const btn = dropdown.querySelector(".dropdown-btn");
        const menu = dropdown.querySelector(".dropdown-menu");
        const label = dropdown.querySelector(".dropdown-label");
        const hidden = dropdown.querySelector("input[type='hidden']");
        const items = dropdown.querySelectorAll(".dropdown-item");
        let currentConfig = await configAccess.currentConfig()

        setDropdownValue(dropdown, currentConfig[dropdown.id])
        updateResetState(dropdown.closest(".row").querySelector(".reset-icon"), defaultConfig[dropdown.id], currentConfig[dropdown.id])

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleDropdown(dropdown, btn, menu)
        });

        menu.addEventListener("click", (e) => {
            const item = e.target.closest(".dropdown-item");
            if (!item) return
            configAccess.setConfig(dropdown.id, item.dataset.value)
            if (dropdown.id === "language") {
                updateLabels(item.dataset.value)
            }
            if (dropdown.id === "scannerMethod" && item.dataset.value === "injection-with-emotes") {
                alert(labels[currentConfig.language]["seventv-alert"]["main"])
            }
            setDropdownValue(dropdown, item.dataset.value)
            updateResetState(dropdown.closest(".row").querySelector(".reset-icon"), defaultConfig[dropdown.id], hidden.value)
            toggleDropdown(dropdown, btn, menu, false);
        });


        document.addEventListener("click", () => {
            if (!dropdown.classList.contains("open"))
                return;
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
        let currentConfig = await configAccess.currentConfig();
        if (typeof currentConfig[id] === "boolean") {
            set(currentConfig[id])
            updateResetState(document.querySelector(`.reset-icon[data-target="${id}"]`), defaultConfig[id], currentConfig[id])
        }
        item.addEventListener('click', () => {
            const isOn = item.classList.toggle('on');
            item.setAttribute('aria-checked', isOn);
            const id = item.id;
            configAccess.setConfig(id, isOn)
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
        let currentConfig = await configAccess.currentConfig()
        input.value = String(currentConfig[id]);
        span.textContent = input.value;
        updateResetState(document.querySelector(`.reset-icon[data-target="${input.id}"]`), defaultConfig[input.id], currentConfig[input.id])
        input.addEventListener("input", () => {
            configAccess.setConfig(input.id, input.value)
            span.textContent = input.value;
            updateResetState(document.querySelector(`.reset-icon[data-target="${input.id}"]`), defaultConfig[input.id], input.value)
        })
    })

    let arrayBasedSettings = [...document.querySelectorAll(".subsection")]
    arrayBasedSettings.forEach(async (item) => {
        const id = item.id
        const input = item.querySelector(".bannedInput");
        const list = item.querySelector(".banned-list");
        const button = item.querySelector(".addBannedButton")

        button.addEventListener('click', async () => {
            let currentConfig = await configAccess.currentConfig()
            const value = input.value.trim();
            if (!value) return;
            if (currentConfig[id].has(value)) {
                return alert('Already added!')
            };
            await configAccess.setConfig(id, currentConfig[id].add(value))
            input.value = '';
            await renderBanned(list, id);
        });

        list.addEventListener('click', async (e) => {
            let currentConfig = await configAccess.currentConfig()
            if (e.target.matches('button[data-value]')) {
                const item = e.target.dataset.value;
                currentConfig[id].delete(item)
                await configAccess.setConfig(id, currentConfig[id])
                await renderBanned(list, id);
            }
        });

        await renderBanned(list, id);
    })
    async function renderBanned(list, id) {
        let currentConfig = await configAccess.currentConfig()
        list.innerHTML = "";
        if (currentConfig[id].length - defaultConfig[id].length === 0) {
            const empty = document.createElement("li");
            empty.className = "muted";
            empty.textContent = "No items added yet."
            list.appendChild(empty);
            updateResetState(document.querySelector(`.reset-icon[data-target="${id}"]`), defaultConfig[id], currentConfig[id])
            return;
        }

        currentConfig[id].forEach((item) => {
            if (defaultConfig[id].has(item)) {
                return;
            }
            const li = document.createElement("li");
            li.classList.add("banned-item")
            li.innerHTML = `
                <span>${item}</span>
                <button class="btn-remove" data-value="${item}" data-label="remove" data-label-type="main"> ${labels[currentConfig["language"]]["remove"]["main"]}</button>
                `;
            list.appendChild(li);
        })

        currentConfig = await configAccess.currentConfig()
        updateResetState(document.querySelector(`.reset-icon[data-target="${id}"]`), defaultConfig[id], currentConfig[id])
    }

    document.querySelectorAll('.reset-icon').forEach(async (reset) => {
        if (reset.dataset.target === "section") {
            reset.addEventListener("click", async () => {
                if (!confirm('Reset this setting to default?')) {
                    return
                };
                const section = reset.closest("section.card.section")
                const allResetsInSection = section.querySelectorAll(".reset-icon")
                allResetsInSection.forEach(async (reset) => {
                    if (reset.dataset.target === "section") return
                    const id = reset.dataset.target;
                    const el = document.getElementById(id);
                    if (!el) {
                        return
                    };

                    let defaultSetting = await configAccess.resetConfig(id);
                    reset.classList.toggle("modified", false);

                    if (el.classList.contains('toggle')) {
                        const on = defaultSetting;
                        el.classList.toggle('on', on);
                        el.setAttribute('aria-checked', on);
                    }
                    else if (el.type === "range") {
                        el.value = String(defaultSetting);
                        el.parentElement.querySelector("span").textContent = el.value;
                    }
                    else if (el.classList.contains("subsection")) {
                        await renderBanned(el.querySelector(".banned-list"), id)
                    }
                    else if (el.classList.contains("dropdown")) {
                        setDropdownValue(el, defaultSetting)
                        if (el.id === "language") {
                            updateLabels(defaultSetting)
                        }
                    }
                })
            })
        }
        else {
            reset.addEventListener('click', async () => {
                const id = reset.dataset.target;
                const el = document.getElementById(id);
                if (!el) {
                    return
                };
                if (!confirm('Reset this setting to default?')) {
                    return
                };

                let defaultSetting = await configAccess.resetConfig(id);
                reset.classList.toggle("modified", false);

                if (el.classList.contains('toggle')) {
                    const on = defaultSetting;
                    el.classList.toggle('on', on);
                    el.setAttribute('aria-checked', on);
                }
                else if (el.type === "range") {
                    el.value = String(defaultSetting);
                    el.parentElement.querySelector("span").textContent = el.value;
                }
                else if (el.classList.contains("subsection")) {
                    await renderBanned(el.querySelector(".banned-list"), id)
                }
                else if (el.classList.contains("dropdown")) {
                    setDropdownValue(el, defaultSetting)
                    if (el.id === "language") {
                        updateLabels(defaultSetting)
                    }
                }
            });
        }
    });

    document.getElementById('closeButton').addEventListener('click', () => {
        window.close()
    });

    document.getElementById("resetButton").addEventListener('click', async () => {
        if (!confirm('Reset settings to defaults?')) return;
        configAccess.clearStorage();
        await updateVisualStates();
        updateLabels(defaultConfig["language"])
    });
})()
