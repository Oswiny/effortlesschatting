"use strict";
import { defaultConfig, labels } from "./config.js";

import { getAllCustomEmotes, getAllNativeEmotes, getAllEmotes } from "./emoteRequestHandler.js";
import { findPathToTarget } from "./internalTraversalHandler.js";
(async () => {
    let isInjected = false;
    let config = {};
    let resolveConfigReady;
    const configReady = new Promise((resolve, reject) => { resolveConfigReady = resolve })
    window.postMessage({ source: "effortless", type: "CONFIG_SYNC" }, "*");

    window.addEventListener("message", (event) => {
        if (event.data?.source === "effortless" && event.data.type === "CONFIG_SYNC" && event.data.payload?.config) {
            const oldConfig = config;
            config = event.data.payload.config;
            resolveConfigReady?.();
            updateLabels(config);
            document.documentElement.style.setProperty("--hoverColor", config.hoverColor)
            updateScannerMethod(config.scannerMethod, oldConfig.scannerMethod)
        }
    });

    await configReady;

    function updateScannerMethod(newScannerMethod, oldScannerMethod = null) {
        if (!isInjected || (oldScannerMethod !== null && oldScannerMethod === newScannerMethod)) {
            return
        }
        scannerMethod();
    }

    function updateLabels(config) {
        document.querySelectorAll("[data-label]").forEach(element => {
            element.textContent = labels[config.language][element.getAttribute("data-label")][element.getAttribute("data-label-type")];
        })
    }

    class Message {
        get count() {
            return this.createdAt.length;
        }
        constructor(text, src = "", srcset = "") {
            this.text = text;
            this.src = src;
            this.srcset = srcset ?? "";
            this.createdAt = [new Date()];
            this.timeoutIds = [];
        }
        printToChat() {
            let text = this.text
            if (!textBoxControllers.selection) {
                textBoxControllers.select(textBoxControllers.range(textBoxControllers.point([0], { edge: config.defaultOffsetPosition })))
            }
            const offset = textBoxControllers.selection.focus.offset;
            if (config.autoSpace && domManager.hasText()) {
                if (offset - 1 > 0 && textbox.textContent[offset - 1] !== " ") {
                    text = " " + text;
                }
                if (offset < textbox.textContent.length && textbox.textContent[offset] !== " ") {
                    text = text + " ";
                }
            }
            textBoxControllers.insertText(text);
        }
    }

    class MessageList {
        constructor() {
            this.list = []
        }
        add(message) {
            let foundMessage = messages.list.find(item => item.text === message.text)
            foundMessage === undefined ? this.list.push(message) : foundMessage.createdAt = foundMessage.createdAt.concat(message.createdAt)
            message.timeoutIds.push(setTimeout(() => {
                let foundMessage = messages.list.find(item => item.text === message.text)
                if (!foundMessage) return
                foundMessage.createdAt = foundMessage.createdAt.filter(item => item !== message.createdAt[0])
                if (foundMessage.count === 0) {
                    messages.list = messages.list.filter(item => item !== foundMessage)
                }
                if (config.updateNodesAfterTimeout && !isMouseOver()) {
                    ContentNode.updateNodes()
                }
            }, config.deleteAfterMs))
        }
        getTop(number) {
            return this.sortedList.slice(0, number)
        }
        get sortedList() {
            return this.list.sort((itemA, itemB) => itemB.count - itemA.count);
        }
    }

    class DomManager {
        constructor() {
            this.root = null
            this.contentNodes = []
        }

        hasText() {
            return textbox.textContent !== "\ufeff"
        }


        scrapeAlreadySent() {
            //needs to readapt
        }

        injectRoot() {
            let seventvSafeChatContainer = document.querySelector("div.chat-input").childNodes[0];

            let root = document.createElement("div");
            root.classList.add("effortlesschatting-root")
            root.addEventListener("mousedown", (e) => {
                e.preventDefault()
            })
            root.innerHTML = `
                <div id="noMessages" style="transition: display 125ms;" class="effortlesschatting-no-message" data-label="noMessages" data-label-type="main">
                    No Messages Found
                </div>
                <div class="effortlesschatting-messagebox-area hidden">
                </div>
            `
            if (config.autoHide) {
                root.querySelector(".effortlesschatting-no-message").classList.add("hidden");
            }
            seventvSafeChatContainer.appendChild(root);
            this.root = root
            return root;
        }

        #createContentNode() {
            let contentNode = document.createElement("div");
            contentNode.style = `transition: background ${config.messageClickAnimationTime}ms ease;`;
            contentNode.classList.add("contentNode");
            contentNode.classList.add("effortlesschatting-messagebox")
            contentNode.classList.add("hidden");
            contentNode.innerHTML = `
            <img loading="lazy" decoding="async" class="effortlesschatting-message-img contentImg hidden" srcset="null">
            `

            let holdTimer = null;
            let hasHeld = false;
            let holdAnimation = null;
            const maxClickDuration = 200;
            let clickStartTime = null;

            function startHold() {
                hasHeld = false;
                clickStartTime = Date.now();
                holdAnimation = contentNode.animate([
                    {
                        backgroundImage: `linear-gradient(${config.holdColor}, ${config.holdColor})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom left",
                        backgroundSize: "100% 0%"
                    },
                    {
                        backgroundImage: `linear-gradient(${config.holdColor}, ${config.holdColor})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom left",
                        backgroundSize: "100% 100%"
                    }
                ], {
                    duration: config.requiredHoldTime,
                    easing: 'linear',
                    fill: 'forwards'
                });

                holdTimer = setTimeout(() => {
                    hasHeld = true;
                    holdAnimation.cancel();
                    holdAnimation = null;
                    const message = contentNode.children[0].alt;
                    sendMessage(message);

                    contentNode.animate([
                        { transform: "scale(1)", filter: "brightness(1)" },
                        { transform: "scale(1.15)", filter: "brightness(1.2)" },
                        { transform: "scale(1)", filter: "brightness(1)" }
                    ], {
                        duration: 300,
                        easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    });
                }, config.requiredHoldTime);
            }

            function stopHold(e) {
                if (holdTimer) clearTimeout(holdTimer);
                if (holdAnimation) {
                    holdAnimation.pause();
                    holdAnimation.playbackRate = -config.drainPlaybackRate;
                    holdAnimation.play();
                    holdAnimation = null;
                }
            }

            contentNode.addEventListener("click", (e) => {
                const clickDuration = Date.now() - clickStartTime;
                if (hasHeld || clickDuration > maxClickDuration) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    hasHeld = false;
                    return;
                }
                contentNode.animate([
                    { transform: "scale(0.9)", backgroundColor: config.tapColor },
                    { transform: "scale(1)", backgroundColor: "transparent" }
                ], {
                    duration: 120,
                    easing: "ease-out"
                });

                console.log("Normal click");
            });


            contentNode.addEventListener("mousedown", startHold);
            ["mouseup", "mouseleave"].forEach(e => contentNode.addEventListener(e, stopHold));
            return new ContentNode(contentNode);
        }

        injectContentNodes() {
            let outerElement = document.querySelector(".effortlesschatting-messagebox-area");
            for (let i = 0; i < config.contentNodeAmount; i++) {
                let contentNode = this.#createContentNode()
                outerElement.appendChild(contentNode.node)
                this.contentNodes.push(contentNode)
            }
        }

        injectFlushButton() {
            let parent = document.querySelector(".chat-input__buttons-container");
            let flushDiv = document.createElement("div");
            flushDiv.classList.add("effortlesschatting-flush-button-outer")
            flushDiv.innerHTML = `
                <div class="effortlesschatting-flush-button-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m16 22-1-4"></path>
                        <path
                            d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1">
                        </path>
                        <path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z"></path>
                        <path d="m8 22 1-4"></path>
                    </svg>
                    <div class="effortlesschatting-flush-tooltip">Flush</div>
                </div>
            `
            function flushMessagesStorage() {
                messages.list.forEach(message => {
                    message.timeoutIds.forEach(timeoutId => {
                        clearTimeout(timeoutId);
                    })
                })
                messages.list.splice(0, messages.list.length);
                emotes = {}
                ContentNode.updateNodes();
            }
            flushDiv.querySelector(".effortlesschatting-flush-button-inner").addEventListener("click", flushMessagesStorage)
            console.log("-----------")
            console.log(parent)
            console.log(parent.lastChild)
            console.log(parent.lastChild.firstChild)
            console.log("-----------")
            parent.lastChild.removeChild(parent.lastChild.firstChild)
            parent.insertBefore(flushDiv, parent.childNodes[parent.childNodes.length - 1]);
            return flushDiv
        }

        isMouseOver() {
            let effortlessChatting = domManager.root
            if (effortlessChatting == null)
                return false
            return effortlessChatting.matches(":hover")
        }

        getEditor() {
            let reactFiber = textbox[Object.keys(textbox).find(item => item.includes("reactFiber"))];
            while (reactFiber) {
                if (reactFiber.memoizedProps && reactFiber.memoizedProps.editor) {
                    reactFiber = reactFiber.memoizedProps.editor;
                    break;
                }
                reactFiber = reactFiber.return
            }
            return reactFiber;
        }

        getSendMessage() {
            let reactFiber = textbox[Object.keys(textbox).filter(item => item.includes("reactFiber"))]
            while (reactFiber) {
                if (reactFiber.memoizedProps && reactFiber.memoizedProps.onSendMessage) {
                    reactFiber = reactFiber.memoizedProps.onSendMessage;
                    break;
                }
                reactFiber = reactFiber.return
            }
            return reactFiber;
        }

        checkSevenTVInstallation() {
            return new Promise((resolve, reject) => {
                let timeoutId = null;
                const observer = new MutationObserver((mutations) => {
                    timeoutId && clearTimeout(timeoutId);
                    if (document.head.querySelector("#seventv-extension") != null && document.head.querySelector("#seventv-stylesheet") != null) {
                        resolve(true)
                    }

                    timeoutId = setTimeout(() => {
                        resolve(false)
                    }, config.seventvInstallationWaitTime);
                })
                observer.observe(document.head, { subtree: true, childList: true })
            })
        }

        waitForSevenTV() {
            function isLoaded() {
                if (document.body.querySelector("#seventv-message-container") && document.body.querySelector("#seventv-settings-button") && document.body.querySelector("aside#live-page-chat[aria-hidden='false']") && document.body.querySelector(".seventv-emote-menu-button") && document.querySelector(".seventv-chat-input-container div.chat-input").childNodes[0].classList.length > 0) {
                    return true
                }
                return false
            }

            return new Promise((resolve, reject) => {
                let observer = new MutationObserver((mutations) => {
                    let loadResult = isLoaded();
                    if (loadResult) {
                        observer.disconnect();
                        resolve(loadResult);
                    }
                });
                observer.observe(document.body, { attributes: true, subtree: true, childList: true })
            })
        }

        waitForTwitch() {
            function isLoaded() {
                if (document.body.querySelector("[role=textbox]") && document.body.querySelector("#WYSIWGChatInputEditor_SkipChat")) {
                    return true
                }
                return false
            }

            return new Promise((resolve, reject) => {
                let observer = new MutationObserver((mutations) => {
                    let loadResult = isLoaded();
                    if (loadResult) {
                        observer.disconnect();
                        resolve(loadResult);
                    }
                });
                observer.observe(document.body, { attributes: true, subtree: true, childList: true })
            })
        }
    }

    class ContentNode {
        constructor(node) {
            this.node = node;
            this.printWrapper = null;
        }

        stopDisplayOn() {
            for (let child of this.node.children) {
                child.classList.add("hidden");
                child.srcset = null;
                child.alt = null;
                if (this.printWrapper) {
                    this.node.removeEventListener("click", this.printWrapper);
                    this.printWrapper = null;
                }
            }
            this.node.classList.add("hidden");
        }

        displayOn(message) {
            let associatedChild = this.node.querySelector(`.contentImg`)
            associatedChild.srcset = message.srcset;
            associatedChild.alt = (associatedChild.srcset !== "" || (message.text.length <= config.maxDisplayLength)) ? message.text : message.text.substring(0, config.maxDisplayLength) + "…";
            associatedChild.classList.remove("hidden")
            this.node.classList.remove("hidden")
            this.printWrapper = function () {
                message.printToChat();
            }
            this.node.addEventListener("click", this.printWrapper)
        }

        static updateNodes() {
            if (!domManager || domManager.contentNodes.length == 0) {
                return
            }
            let topElements = messages.getTop(config.contentNodeAmount);
            let isAnyMessageFound = false;
            for (let i = 0; i < config.contentNodeAmount; i++) {
                domManager.contentNodes[i].stopDisplayOn()
                if (topElements[i] && topElements[i].text) {
                    domManager.contentNodes[i].displayOn(topElements[i])
                    isAnyMessageFound = true;
                }
            }
            if (isAnyMessageFound) {
                document.querySelector(".effortlesschatting-no-message").classList.add("hidden");
                document.querySelector(".effortlesschatting-messagebox-area").classList.remove("hidden");
            }
            else {
                if (config.autoHide) {
                    document.querySelector(".effortlesschatting-no-message").classList.add("hidden");
                }
                else {
                    document.querySelector(".effortlesschatting-no-message").classList.remove("hidden");
                }
                document.querySelector(".effortlesschatting-messagebox-area").classList.add("hidden");
            }
        }

    }

    let domManager = null;
    let isSevenTvInstalled = null;
    let messages = null;
    let textbox = null;
    let textBoxControllers = null;
    let sendMessage = null;

    //if for some reason chat box gets removed we inject it
    function checkInjection() {
        const observer = new MutationObserver(async function () {
            const isChannel = /^https?:\/\/www\.twitch\.tv\/[a-zA-Z0-9_]+$/.test(window.location.href);

            if (!isChannel) return;

            const root = document.querySelector(".effortlesschatting-root");
            const flush = document.querySelector(".effortlesschatting-flush-button-outer");
            const contentNodes = document.querySelectorAll(".contentNode");

            if (domManager && root && flush && contentNodes.length !== 0) {
                return
            }

            //we have to remove all elements to prevent duplicates
            if (root) root.remove()
            if (flush) flush.remove()
            if (contentNodes.length !== 0) contentNodes.forEach(contentNode => contentNode.remove())

            observer.disconnect()
            console.log("starting inject process")
            domManager = new DomManager();
            isSevenTvInstalled = await domManager.checkSevenTVInstallation() // i guess normally you do this by checking if window.seventv exists. but i already done it this way. so lets just wait and see, if changing it is better i will change it.
            console.log("Is SevenTV Installed: ", isSevenTvInstalled);
            if (isSevenTvInstalled) {
                await domManager.waitForSevenTV();
            }
            await domManager.waitForTwitch();
            messages = new MessageList();
            textbox = document.querySelector("[role=textbox]")
            textBoxControllers = domManager.getEditor();
            sendMessage = domManager.getSendMessage();
            domManager.injectRoot();
            domManager.injectFlushButton();
            domManager.injectContentNodes();
            //domManager.scrapeAlreadySent();
            writeMessagesByClick()
            isInjected = true;
            updateScannerMethod();
            observer.observe(document, { childList: true, subtree: true })
        })

        observer.observe(document, { childList: true, subtree: true });
    }
    checkInjection();


    function writeMessagesByClick() {
        const chatMessagesContainer = document.querySelector(".chat-list--default");
        const getWordIndexes = function (text, offset) {
            if (defaultConfig.bannedWords.has(text[offset])) return null;

            let start = offset
            let end = offset

            while (start > 0 && !defaultConfig.bannedWords.has(text[start - 1])) {
                start--;
            }

            while (end < text.length && !defaultConfig.bannedWords.has(text[end])) {
                end++;
            }

            if (start === end) return null;
            return { start, end };
        }


        const onClick = function (event) {
            if (!config.allowClickToWrite) return;
            if (config.onlyClickWriteOnPause && !(document.querySelector(".chat-paused-footer") || document.querySelector(".seventv-message-buffer-notice"))) return;
            // i first tried to find pause functions although it was easy for normal twitch, i was not able to find it for 7tv
            // if i find a way to for seventv to i will switch to that
            
            const target = event.target
            let isBadge = false;
            let isUserName = false;

            for (const attribute of target.attributes) {
                const value = attribute.value
                if (isUserName && isBadge) break;
                if (!isBadge && value.includes("badge")) isBadge = true
                if (!isUserName && value.includes("name")) isUserName = true
            }

            if (isBadge) return;

            let clickedWord = null
            if (event.target.nodeName === "IMG") {
                clickedWord = event.target.alt
            }
            else {
                let textNode = null;
                let offset = null;
                const caretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);
                textNode = caretPosition.offsetNode;
                offset = caretPosition.offset

                if (textNode && textNode.nodeType === 3) {
                    const textContent = textNode.textContent;
                    const wordIndexes = getWordIndexes(textContent, offset)

                    if (wordIndexes) {
                        const tempClickedWord = textContent.substring(wordIndexes.start, wordIndexes.end).trim();
                        if (tempClickedWord.length > 0) clickedWord = tempClickedWord
                    }
                }
            }

            if (!clickedWord) return;

            if (!isUserName) {
                const wrapper = target.parentElement.closest("[class]")
                if (wrapper) {
                    for (const attribute of wrapper.attributes) {
                        if (attribute.value.includes("name")) {
                            isUserName = true;
                            break;
                        }
                    }
                }
            }

            if (isUserName) {
                if(!config.allowUserNameClickToWrite) return;
                if(config.autoUserNameTag && !clickedWord.startsWith("@")) 
                    clickedWord = "@" + clickedWord
            }
            else {
                console.log("clicked on a text ", clickedWord)
            }
        }

        chatMessagesContainer.addEventListener("click", onClick)


    }

    let emotes = {}
    function scrapeOnEvent(messageData) {
        if (messageData.message.user.badges && ((!config.scrapeMods && messageData.message.user.badges.moderator) ||
            (!config.scrapeVIPs && messageData.message.isVip) ||
            (!config.scrapeBots && messageData.message.user.badges.chatbot))) {
            return;
        }
        if (!messages) return

        if (config.scrapeOnlySubs) { //make sure chatbot is a actual thing
            if (messageData.message.isSubscriber && (Number(messageData.message.user.badges.Subscriber) < config.scrapeSubsWithMinimumMonths)) {
                return
            }
        }

        if (config.bannedUsers.has(messageData.message.user.userName)) {
            return
        }

        const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

        let uniqueWordsInMessage = Array.from(new Set(messageData.message.body.trim().split(" ").filter(item => {
            return (item.length <= Number(config.maxScanLength) && !config.bannedWords.has(item) && (config.allowLinks || !linkRegex.test(item)) && (config.allowMentions || !(item?.[0] === "@")))
        })))
        uniqueWordsInMessage.forEach(word => {
            messages.add(new Message(word, "", emotes[word]))
        });
    }

    function scrapeOnSeventv(messageData) {
        if (messageData.badges && ((!config.scrapeMods && messageData.badges.moderator) || (!config.scrapeVIPs && messageData.vip) || (!config.scrapeBots && messageData.badges.chatbot))) //make sure vip and chatbot are the way they are
        {
            return;
        }

        if (!messages) return

        if (config.scrapeOnlySubs) {
            if (!messageData.badges.Subscriber || (messageData.badges.Subscriber && (Number(messageData.badges.Subscriber) < config.scrapeSubsWithMinimumMonths))) {
                return
            }
        }

        if (config.bannedUsers.has(messageData.author.username)) {
            return
        }

        const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

        let uniqueWordsInMessage = Array.from(new Set(messageData.body.trim().split(" ").filter(item => {
            return (item.length <= config.maxScanLength && !config.bannedWords.has(item) && (config.allowLinks || !linkRegex.test(item)) && (config.allowMentions || !(item?.[0] === "@")))
        })))
        let emotesInCurrentMessage = {}
        messageData.tokens.forEach(token => emotesInCurrentMessage[token.content.emote.data.name] = token.content.emote.data.host.srcset)
        uniqueWordsInMessage.forEach(word => messages.add(new Message(word, "", emotesInCurrentMessage[word])));
    }

    let startElement = null;
    let startFiber = null;
    const functionName = "onChatMessageEvent";
    let fiber = null;
    let originalOnChatMessageEvent = null;
    let originalInsertBefore = Node.prototype.insertBefore
    async function scannerMethod() {
        emotes = {}

        startFiber = document.reactFiberSelector(".chat-room__content")
        fiber = findPathToTarget(startFiber, functionName).fiber

        if (originalOnChatMessageEvent !== null) {
            fiber.stateNode.onChatMessageEvent = originalOnChatMessageEvent
        }
        else {
            originalOnChatMessageEvent = fiber.stateNode.onChatMessageEvent
        }
        Node.prototype.insertBefore = originalInsertBefore;

        if (config.scannerMethod === "text-only") {
            fiber.stateNode.onChatMessageEvent = function (...args) {
                if (args[0] && (config.allowSelf || (!config.allowSelf && !args[0].sentByCurrentUser))) {
                    scrapeOnEvent(args[0])
                    if (!domManager.isMouseOver()) {
                        ContentNode.updateNodes()
                    }
                }
                return originalOnChatMessageEvent.apply(this, args)
            }
        }
        if (config.scannerMethod === "fetch-native") {
            emotes = await getAllNativeEmotes();
            fiber.stateNode.onChatMessageEvent = function (...args) {
                if (args[0] && (config.allowSelf || (!config.allowSelf && !args[0].sentByCurrentUser))) {
                    scrapeOnEvent(args[0])
                    if (!domManager.isMouseOver()) {
                        ContentNode.updateNodes()
                    }
                }
                return originalOnChatMessageEvent.apply(this, args)
            }
        }
        if (config.scannerMethod === "insert-before") {
            let scanEmotesFlag = { flag: false, param: null };
            fiber.stateNode.onChatMessageEvent = function (...args) {
                if (args[0] && (config.allowSelf || (!config.allowSelf && !args[0].sentByCurrentUser))) {
                    scanEmotesFlag = { flag: true, param: args[0] };
                };
                return originalOnChatMessageEvent.apply(this, args)
            }
            Node.prototype.insertBefore = function (...args) {
                if (scanEmotesFlag.flag && scanEmotesFlag.param) {
                    if (args[0].className === "seventv-user-message") {
                        let emoteImages = args[0].querySelectorAll("img.seventv-chat-emote")
                        emoteImages.forEach(emote => {
                            if (!emotes[emote.alt]) {
                                emotes[emote.alt] = emote.srcset;
                            }
                        })
                        scanEmotesFlag.flag = false;
                        scrapeOnEvent(scanEmotesFlag.param)
                        scanEmotesFlag.param = null;
                        if (!domManager.isMouseOver()) {
                            ContentNode.updateNodes()
                        }
                    }
                }
                else {
                    scanEmotesFlag.flag = false;
                    scanEmotesFlag.param = null
                }
                return originalInsertBefore.apply(this, args);
            }
        }
        if (config.scannerMethod === "fetch-all") {
            emotes = await getAllEmotes();
            fiber.stateNode.onChatMessageEvent = function (...args) {
                if (args[0] && (config.allowSelf || (!config.allowSelf && !args[0].sentByCurrentUser))) {
                    scrapeOnEvent(args[0])
                    if (!domManager.isMouseOver()) {
                        ContentNode.updateNodes()
                    }
                }
                return originalOnChatMessageEvent.apply(this, args)
            }
        }
        if (config.scannerMethod === "tokens-tooltip") {
            const seventvRoot = document.querySelector("#seventv-root")
            const patchOrig = seventvRoot.__vue_app__._context.directives.tooltip.mounted
            seventvRoot.__vue_app__._context.directives.tooltip.mounted = function (...args) {
                if (args[1]?.value === "Copy" || args[1]?.value === "Pin" || args[1]?.value === "Reply" || (args[1]?.value !== "")) {
                    scrapeOnSeventv(args[1].instance._.props.msg)
                    if (!domManager.isMouseOver()) {
                        ContentNode.updateNodes()
                    }
                }
                return patchOrig.apply(this, args)
            }
        }
        if (config.scannerMethod === "tokens-paint") {
            const seventvRoot = document.querySelector("#seventv-root")
            const patchOrig = seventvRoot.__vue_app__._context.directives["cosmetic-paint"].mounted
            seventvRoot.__vue_app__._context.directives["cosmetic-paint"].mounted = function (...args) {
                if (args[1].instance._.parent.props.msg) {
                    scrapeOnSeventv(args[1].instance._.parent.props.msg)
                    if (!domManager.isMouseOver()) {
                        ContentNode.updateNodes()
                    }
                }
                return patchOrig.apply(this, args)
            }
        }




        if (config.scannerMethod === "injection-with-emotes" && !isSevenTvInstalled) {
            const noMessages = document.querySelector("#noMessages")
            noMessages.setAttribute("data-label", "seventv-not-detected")
        }
        else {
            noMessages.setAttribute("data-label", "noMessages")
        }
        updateLabels(config)

    }
})()