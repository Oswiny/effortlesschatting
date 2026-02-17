"use strict";
import * as configAccess from "../configAccess.js";
import { defaultConfig, labels } from "../config.js";
import { colord, extend } from './colord/colord.js';
import mixPlugin from "./colord/plugins/mix.js"
extend([mixPlugin]);

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
            const input = item.childNodes[1]
            const span = item.childNodes[3]
            if (input.id.includes("max") && currentConfig[input.id] === Number(input.max)) { //TRANSLATION IS NEEDED
                span.textContent = Infinity;
                input.value = input.max
            }
            else {
                input.value = currentConfig[input.id]
                span.textContent = input.value;
            }
            updateResetState(item.closest(".row").querySelector(".reset-icon"), defaultConfig[item.childNodes[1].id], currentConfig[item.childNodes[1].id])

        })
        arrayBasedSettings.forEach(async (item) => {
            const list = item.querySelector(".banned-list")
            await renderBanned(list, item.id)
            updateResetState(item.querySelector(".reset-icon"), defaultConfig[item.id], currentConfig[item.id])
        })
        colorPickers.forEach(colorPicker => {
            const toggleButton = colorPicker.querySelector(".toggle-picker");
            const pickerPanel = colorPicker.querySelector(".picker-panel");
            /*             const satMap = colorPicker.querySelector(".sat-map");
                        const satCanvas = colorPicker.querySelector(".sat-canvas");
                        const satPointer = colorPicker.querySelector(".sat-pointer");
                        const hueBar = colorPicker.querySelector(".hue-bar");
                        const huePointer = colorPicker.querySelector(".hue-pointer");
                        const hexInput = colorPicker.querySelector("input[data-type='hex']");
                        const rgbInput = colorPicker.querySelector("input[data-type='rgb']");
                        const previewColor = colorPicker.querySelector(".preview-side"); */
            const presetList = colorPicker.querySelector(".preset-list");

            toggleButton.classList.remove("active")
            pickerPanel.classList.remove("open")
            Object.values(presetList.children).forEach(preset => {
                if (defaultConfig[colorPicker.dataset.target] !== preset.dataset.color) preset.classList.remove("active")
                else preset.classList.add("active")
            })

            toggleButton.style.backgroundColor = null;
            toggleButton.style.color = "#efeff1"

            document.documentElement.style.setProperty("--" + colorPicker.dataset.target, defaultConfig[colorPicker.dataset.target]);
            updateResetState(colorPicker.closest(".row").querySelector(".reset-icon"), defaultConfig[colorPicker.dataset.target], currentConfig[colorPicker.dataset.target])

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
        if (input.id.includes("max") && input.value === input.max) { //TRANSLATION IS NEEDED
            span.textContent = Infinity
        }
        else {
            span.textContent = input.value;
        }
        updateResetState(document.querySelector(`.reset-icon[data-target="${input.id}"]`), defaultConfig[input.id], currentConfig[input.id])
        input.addEventListener("input", async () => {
            if (input.id.includes("max") && input.value === input.max) { //TRANSLATION IS NEEDED
                await configAccess.setConfig(input.id, Infinity)
                span.textContent = Infinity
            }
            else {
                span.textContent = input.value;
                await configAccess.setConfig(input.id, Number(input.value))
            }
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

    const pngSquares = {
        light: {
            square1: "#FFFFFF",
            square2: "#CDCDCD",
        },
        dark: {
            square1: "#282828",
            square2: "#3E3E3E",
        }
    }
    const backgroundColord = colord("#1b1b1b")
    const colorPickers = document.querySelectorAll(".color-picker")
    colorPickers.forEach(async (colorPicker) => {
        const toggleButton = colorPicker.querySelector(".toggle-picker");
        const pickerPanel = colorPicker.querySelector(".picker-panel");
        const satMap = colorPicker.querySelector(".sat-map");
        const satCanvas = colorPicker.querySelector(".sat-canvas");
        const satPointer = colorPicker.querySelector(".sat-pointer");
        const hueBar = colorPicker.querySelector(".hue-bar");
        const huePointer = colorPicker.querySelector(".hue-pointer");
        const alphaBar = colorPicker.querySelector(".alpha-bar");
        const alphaPointer = colorPicker.querySelector(".alpha-pointer");
        const hexInput = colorPicker.querySelector("input[data-type='hex']");
        const rgbInput = colorPicker.querySelector("input[data-type='rgb']");
        const previewColor = colorPicker.querySelector(".preview-side");
        const presetList = colorPicker.querySelector(".preset-list");
        const resetIcon = colorPicker.closest("div.row").querySelector(".reset-icon");
        const hasAlpha = (alphaBar !== null && alphaPointer !== null);

        let currentConfig = (await configAccess.currentConfig())
        let selectedColor = currentConfig[colorPicker.dataset.target]
        let starterColordCustom = colord(currentConfig[colorPicker.dataset.target + "Custom"]);
        let starterHsva = null
        let currentHue = null
        let currentSat = null
        let currentVal = null
        let currentAlpha = null
        let isActiveFound = false;
        let colordObject = colord(selectedColor);
        let currentDarkness = null
        let currentDarknessColord = null
        document.documentElement.style.setProperty("--" + colorPicker.dataset.target, selectedColor)

        function getIsDark()
        {
            if(!currentDarkness || !currentDarknessColord || !currentDarknessColord.isEqual(colordObject))
            {
                if(hasAlpha && colordObject.alpha() < 1)
                {
                    currentDarkness = backgroundColord.mix(colordObject.alpha(1), colordObject.alpha()).isDark()
                }
                else
                {
                    currentDarkness = colordObject.isDark();
                }
            }
            currentDarknessColord = colordObject
            return currentDarkness;
        }

        toggleButton.style.backgroundColor = starterColordCustom.isValid() ? starterColordCustom.toRgbString() : null;
        toggleButton.style.color = starterColordCustom.isValid() ? (getIsDark() ? "#efeff1" : "#10100e"): "#efeff1";
        if (colorPicker.id === "accent") {
            document.documentElement.style.setProperty("--text-visible", getIsDark() ? "#efeff1" : "#10100e")
        }

        const colordPresets = {};

        Object.values(presetList.children).forEach((preset) => {
            colordPresets[preset.dataset.color] = colord(preset.dataset.color);
            preset.addEventListener("click", async () => {
                document.documentElement.style.setProperty("--" + colorPicker.dataset.target, preset.dataset.color);
                await configAccess.setConfig(colorPicker.dataset.target, preset.dataset.color)
                currentConfig[colorPicker.dataset.target] = preset.dataset.color
                colordObject = colordPresets[preset.dataset.color]
                if (colorPicker.id === "accent") {
                    document.documentElement.style.setProperty("--text-visible", getIsDark() ? "#efeff1" : "#10100e")
                }
                updateResetState(resetIcon, defaultConfig[colorPicker.dataset.target], currentConfig[colorPicker.dataset.target])
                if (pickerPanel.classList.contains("open")) {
                    await configAccess.setConfig(colorPicker.dataset.target + "Custom", preset.dataset.color)
                    const newHsv = colordObject.toHsv();
                    if (newHsv.s > 0) {
                        currentHue = newHsv.h;
                    }
                    currentSat = newHsv.s;
                    currentVal = newHsv.v;
                    currentAlpha = newHsv.a;
                    update()
                }
                else {
                    Object.values(presetList.children).forEach(preset => preset.classList.remove("active"));
                    toggleButton.classList.remove("active")
                    preset.classList.add("active");
                }
            });
            if (colordPresets[preset.dataset.color].isEqual(selectedColor)) {
                preset.classList.add("active");
                isActiveFound = true;
            }
        });

        if (!isActiveFound) {
            toggleButton.classList.add("active")
        }

        const satRect2 = satMap.getBoundingClientRect();
        satCanvas.width = satRect2.width;
        satCanvas.height = satRect2.height;

        toggleButton.addEventListener("click", async () => {
            const isOpen = pickerPanel.classList.toggle("open");
            toggleButton.classList.toggle("active", true);
            if (isOpen) {
                currentConfig = (await configAccess.currentConfig())
                selectedColor = currentConfig[colorPicker.dataset.target];
                starterHsva = starterColordCustom?.toHsv()
                currentHue = starterHsva.h;
                currentSat = starterHsva.s;
                currentVal = starterHsva.v;
                currentAlpha = starterHsva.a
                colordObject = starterColordCustom
                hexInput.value = colordObject.toHex();
                rgbInput.value = colordObject.toRgbString().match(/\(([^)]+)\)/)[1]
                toggleButton.style.backgroundColor = currentConfig[colorPicker.dataset.target + "Custom"]
                toggleButton.style.color = getIsDark() ? "#efeff1" : "#10100e";
                if (colorPicker.id === "accent") {
                    document.documentElement.style.setProperty("--text-visible", getIsDark() ? "#efeff1" : "#10100e")
                }
                Object.values(presetList.children).forEach(preset => { preset.classList.remove("active") })
                configAccess.setConfig(colorPicker.dataset.target, currentConfig[colorPicker.dataset.target + "Custom"])
                currentConfig[colorPicker.dataset.target] = currentConfig[colorPicker.dataset.target + "Custom"]
                updateResetState(resetIcon, defaultConfig[colorPicker.dataset.target], currentConfig[colorPicker.dataset.target])
                update()
            }
        });

        async function update(source = "default") {
            const hex = colordObject.toHex();
            const rgb = colordObject.toRgbString();

            if (source !== "hex") hexInput.value = hex.toUpperCase();
            if (source !== "rgb") rgbInput.value = rgb.match(/\(([^)]+)\)/)[1];

            drawSatMap(currentHue);

            previewColor.style.backgroundColor = hex;

            satPointer.style.left = currentSat + "%";
            satPointer.style.top = (100 - currentVal) + "%";
            satPointer.style.backgroundColor = hex;

            huePointer.style.left = (currentHue / 360) * 100 + "%";
            huePointer.style.backgroundColor = `hsl(${currentHue}, 100%, 50%)`;

            if (hasAlpha) {
                alphaPointer.style.left = (currentAlpha) * 100 + "%";

                let square1 = null;
                let square2 = null;

                if (getIsDark()) {
                    square1 = pngSquares.light.square1;
                    square2 = pngSquares.light.square2;
                }
                else {
                    square1 = pngSquares.dark.square1
                    square2 = pngSquares.dark.square2;
                }

                alphaBar.style.backgroundImage = `
                    linear-gradient(to right, ${colordObject.alpha(0).toRgbString()} 0%, ${colordObject.alpha(1).toRgbString()} 100%),
                    conic-gradient(${square1} 0.25turn, ${square2} 0.25turn 0.5turn, ${square1} 0.5turn 0.75turn, ${square2} 0.75turn)
                `;
            }

            if (colorPicker.id === "accent") {
                document.documentElement.style.setProperty("--text-visible", getIsDark() ? "#efeff1" : "#10100e")
            }

            toggleButton.style.color = getIsDark() ? "#efeff1" : "#10100e";
            toggleButton.style.backgroundColor = hex

            document.documentElement.style.setProperty("--" + colorPicker.dataset.target, hex);
        }

        function drawSatMap(h) {
            const ctx = satCanvas.getContext("2d");
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;

            ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
            ctx.fillRect(0, 0, width, height);

            const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
            whiteGradient.addColorStop(0, 'rgba(255,255,255,1)');
            whiteGradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = whiteGradient;
            ctx.fillRect(0, 0, width, height);

            const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
            blackGradient.addColorStop(0, 'rgba(0,0,0,0)');
            blackGradient.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = blackGradient;
            ctx.fillRect(0, 0, width, height);
        }

        function moveSat(e) {
            const satRect = satMap.getBoundingClientRect();
            currentSat = Math.max(0, Math.min(100, ((e.clientX - satRect.left) / satRect.width) * 100));
            currentVal = Math.max(0, Math.min(100, 100 - ((e.clientY - satRect.top) / satRect.height) * 100));
            colordObject = colord({ h: currentHue, s: currentSat, v: currentVal, a: currentAlpha });
            update();
        }

        satMap.addEventListener("mousedown", (e) => {
            moveSat(e);
            const onMove = (ev) => moveSat(ev);
            const onUp = async () => {
                await configAccess.setConfig(colorPicker.dataset.target, colordObject.toRgbString())
                await configAccess.setConfig(colorPicker.dataset.target + "Custom", colordObject.toRgbString())
                console.log(await configAccess.currentConfig())
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        });

        function moveHue(e) {
            const hueRect = hueBar.getBoundingClientRect();
            currentHue = Math.max(0, Math.min(360, ((e.clientX - hueRect.left) / hueRect.width) * 360));
            colordObject = colord({ h: currentHue, s: currentSat, v: currentVal, a: currentAlpha });
            update();
        }

        hueBar.addEventListener("mousedown", (e) => {
            moveHue(e);
            const onMove = (ev) => moveHue(ev);
            const onUp = async () => {
                await configAccess.setConfig(colorPicker.dataset.target, colordObject.toRgbString())
                await configAccess.setConfig(colorPicker.dataset.target + "Custom", colordObject.toRgbString())
                console.log(await configAccess.currentConfig())
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        });

        function moveAlpha(e) {
            const alphaRect = alphaBar.getBoundingClientRect();
            currentAlpha = Math.max(0, Math.min(1, ((e.clientX - alphaRect.left) / alphaRect.width)));
            colordObject = colord({ h: currentHue, s: currentSat, v: currentVal, a: currentAlpha });
            update();
        }

        if (hasAlpha) {
            alphaBar.addEventListener("mousedown", (e) => {
                moveAlpha(e);
                const onMove = (ev) => moveAlpha(ev);
                const onUp = async () => {
                    await configAccess.setConfig(colorPicker.dataset.target, colordObject.toRgbString())
                    await configAccess.setConfig(colorPicker.dataset.target + "Custom", colordObject.toRgbString())
                    console.log(await configAccess.currentConfig())
                    window.removeEventListener("mousemove", onMove);
                    window.removeEventListener("mouseup", onUp);
                }
                window.addEventListener("mousemove", onMove);
                window.addEventListener("mouseup", onUp);
            })
        }

        hexInput.addEventListener("change", () => {
            let val = hexInput.value
            if (!val.startsWith('#')) val = '#' + val;
            const newColordObject = colord(val);
            if (newColordObject.isValid()) {
                colordObject = newColordObject;
                const newHsv = colordObject.toHsv();
                currentSat = newHsv.s;
                currentVal = newHsv.v;
                if (newHsv.s > 0) {
                    currentHue = newHsv.h;
                }

                update("hex");
            }
        });

        rgbInput.addEventListener("change", () => {
            const val = "rgb(" + rgbInput.value + ")";
            const newColordObject = colord(val);
            if (newColordObject.isValid()) {
                colordObject = newColordObject;
                const newHsv = colordObject.toHsv();
                currentSat = newHsv.s;
                currentVal = newHsv.v;
                if (newHsv.s > 0) {
                    currentHue = newHsv.h;
                }

                update("rgb");
            }
        });
    })

    document.querySelectorAll('.reset-icon').forEach(async (reset) => {
        if (reset.dataset.target === "section") {
            reset.addEventListener("click", async () => {
                currentConfig = await configAccess.currentConfig()
                if (!confirm(labels[currentConfig["language"]]["resetSection"]["main"])) {
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
                    else if (el.classList.contains("color-picker")) {
                        let colorPicker = el
                        const toggleButton = colorPicker.querySelector(".toggle-picker");
                        const pickerPanel = colorPicker.querySelector(".picker-panel");
                        /*             const satMap = colorPicker.querySelector(".sat-map");
                                    const satCanvas = colorPicker.querySelector(".sat-canvas");
                                    const satPointer = colorPicker.querySelector(".sat-pointer");
                                    const hueBar = colorPicker.querySelector(".hue-bar");
                                    const huePointer = colorPicker.querySelector(".hue-pointer");
                                    const hexInput = colorPicker.querySelector("input[data-type='hex']");
                                    const rgbInput = colorPicker.querySelector("input[data-type='rgb']");
                                    const previewColor = colorPicker.querySelector(".preview-side"); */
                        const presetList = colorPicker.querySelector(".preset-list");

                        toggleButton.classList.remove("active")
                        pickerPanel.classList.remove("open")
                        Object.values(presetList.children).forEach(preset => {
                            if (defaultConfig[colorPicker.dataset.target] !== preset.dataset.color) preset.classList.remove("active")
                            else preset.classList.add("active")
                        })

                        toggleButton.style.backgroundColor = null;
                        toggleButton.style.color = "#efeff1"

                        document.documentElement.style.setProperty("--" + colorPicker.dataset.target, defaultConfig[colorPicker.dataset.target]);
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
                if (!confirm(labels[currentConfig["language"]]["resetSingle"]["main"])) {
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
                else if (el.classList.contains("color-picker")) {
                    let colorPicker = el
                    const toggleButton = colorPicker.querySelector(".toggle-picker");
                    const pickerPanel = colorPicker.querySelector(".picker-panel");
                    /*             const satMap = colorPicker.querySelector(".sat-map");
                                const satCanvas = colorPicker.querySelector(".sat-canvas");
                                const satPointer = colorPicker.querySelector(".sat-pointer");
                                const hueBar = colorPicker.querySelector(".hue-bar");
                                const huePointer = colorPicker.querySelector(".hue-pointer");
                                const hexInput = colorPicker.querySelector("input[data-type='hex']");
                                const rgbInput = colorPicker.querySelector("input[data-type='rgb']");
                                const previewColor = colorPicker.querySelector(".preview-side"); */
                    const presetList = colorPicker.querySelector(".preset-list");

                    toggleButton.classList.remove("active")
                    pickerPanel.classList.remove("open")
                    Object.values(presetList.children).forEach(preset => {
                        if (defaultConfig[colorPicker.dataset.target] !== preset.dataset.color) preset.classList.remove("active")
                        else preset.classList.add("active")
                    })

                    toggleButton.style.backgroundColor = null;
                    toggleButton.style.color = "#efeff1"

                    document.documentElement.style.setProperty("--" + colorPicker.dataset.target, defaultConfig[colorPicker.dataset.target]);
                }
            });
        }
    });

    document.getElementById('closeButton').addEventListener('click', () => {
        window.close()
    });

    document.getElementById("resetButton").addEventListener('click', async () => {
        if (!confirm(labels[currentConfig["language"]]["resetAll"]["main"])) return;
        await configAccess.clearStorage();
        await updateVisualStates();
        updateLabels(defaultConfig["language"])
    });

    //temporary
    function autoSizeSVGs() {
        const svgs = document.querySelectorAll("svg");

        svgs.forEach(svg => {
            const bbox = svg.getBBox();

            const padding = 1;

            const x = bbox.x - padding;
            const y = bbox.y - padding;
            const w = bbox.width + (padding * 2);
            const h = bbox.height + (padding * 2);
            svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
        });
    }
    autoSizeSVGs()
})()
