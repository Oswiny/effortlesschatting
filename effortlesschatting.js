"use strict";
(async () => {
    let { requestConfig } = await import((new URL("./configManager.js", import.meta.url).href));

    const querySelected = {};

    function handleUpdatesInConfig(event) {
        if (event.data.effortless && event.data.type === "updateConfig") {
            Config = event.data.config
        }
    }
    window.addEventListener("message", handleUpdatesInConfig)

    let Config = await requestConfig();
    console.log(Config);
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
                textBoxControllers.select(textBoxControllers.range(textBoxControllers.point([0], { edge: Config.defaultOffsetPosition })))
            }
            const offset = textBoxControllers.selection.focus.offset;
            if (Config.autoSpace && hasText()) {
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
                console.log("trying to delete message ", message)
                let foundMessage = messages.list.find(item => item.text === message.text)
                foundMessage.createdAt = foundMessage.createdAt.filter(item => item !== message.createdAt[0])
                if (foundMessage.count === 0) {
                    messages.list = messages.list.filter(item => item !== foundMessage)
                }
                if (Config.updateNodesAfterTimeout && !isMouseOver()) {
                    ContentNode.updateNodes()
                }
            }, Config.deleteAfterMs))
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
            this.selectors = {
                root: ".effortlesschatting-root",
                flush: ".effortlesschatting-flush-button-outer",
                contentNodes: ".contentNode",
            }
            this.root = null
            this.contentNodes = []
        }

        scrapeAlreadySent() {
            if (Config.scrapeAlreadySentMessages) {
                chatEntry.childNodes.forEach(item => { this.scrape(item) });
                ContentNode.updateNodes()
            }
        }

        scrape(message) {
            if (!(message.nodeName === "DIV" && message.classList.contains("seventv-message"))) {
                return
            }
            const badges = Array.from(message.querySelector("span.seventv-chat-user-badge-list")?.querySelectorAll("img") ?? []).map(item => item.alt);
            const userName = message.querySelector("span.seventv-chat-user-username")?.innerText;
            let messageBody = message.querySelector("span.seventv-chat-message-body");

            if ((!Config.scrapeMods && badges.includes("Moderator")) || (!Config.scrapeVIPs && badges.includes("VIP")) || (!Config.scrapeBots && badges.includes("Chat Bot"))) {
                return;
            }

            //only on english
            if (Config.scrapeOnlySubs) {
                let subBadge = (badges.filter(item => item.includes("Subscriber")).length > 0)
                if (!subBadge.length) {
                    return
                }
                if (subscriberMonthCalculator(subBadge) < Config.scrapeSubsWithMinimumMonths) {
                    return
                }
            }

            if (!Config.bannedUsers.includes(userName)) {
                if (Config.allowText) {
                    if (messageBody) {
                        let uniqueWordsInMessage = Array.from(new Set(messageBody.innerText.split(" ").filter(item => !Config.bannedWords.includes(item))));
                        uniqueWordsInMessage.forEach(word => {
                            messages.add(new Message(word));
                        })
                    }
                }

                let emotesInAMessage = messageBody?.querySelectorAll("img.seventv-chat-emote")
                if (emotesInAMessage) {
                    let uniqueEmotesInAMessage = [...new Map(Array.from(emotesInAMessage).map(item => [item["currentSrc"], item])).values()].filter(item => !Config.bannedEmotes.includes(item.alt));
                    uniqueEmotesInAMessage.forEach(emote => {
                        messages.add(new Message(emote.alt, emote.currentSrc, emote.srcset))
                    })
                }
            }
        }

        injectRoot() {
            let seventvSafeChatContainer = document.querySelector(".seventv-chat-input-container div.chat-input").childNodes[0]; //HERE

            let root = document.createElement("div");
            root.classList.add("effortlesschatting-root")
            root.addEventListener("mousedown", (e) => {
                e.preventDefault()
            })
            root.innerHTML = `
                <div id="noMessages" style="transition: display 125ms;" class="effortlesschatting-no-message">
                    No Messages Were Found
                </div>
                <div class="effortlesschatting-messagebox-area hidden">
                </div>
            `
            if (Config.autoHide) {
                root.querySelector(".effortlesschatting-no-message").classList.add("hidden");
            }
            seventvSafeChatContainer.appendChild(root);
            this.root = root
            return root;
        }

        #createContentNode() {
            let contentNode = document.createElement("div");
            contentNode.style = `transition: background ${Config.messageClickAnimationTime}ms ease;`;
            contentNode.classList.add("contentNode");
            contentNode.classList.add("effortlesschatting-messagebox")
            contentNode.classList.add("hidden");
            contentNode.innerHTML = `
            <img loading="lazy" decoding="async" class="effortlesschatting-message-img contentImg hidden" srcset="null">
            <div class="effortlesschatting-message-text contentText hidden">
            </div>
            `

            contentNode.addEventListener("click", (e) => {
                if (hasHeld) {
                    e.stopImmediatePropagation()
                    e.preventDefault()
                    hasHeld = false;
                    return;
                }

                contentNode.style.background = "var(--seventv-highlight-neutral-1)"
                setTimeout(() => {
                    contentNode.style.background = ""
                }, Config.messageClickAnimationTime);

            })

            let whileHeldId = null
            let hasHeld = false;
            function whileHeld(currentTime) {
                whileHeldId = requestAnimationFrame(whileHeld);
                if (currentTime - startTime >= Config.requiredHoldTime) {
                    stopHold();
                    hasHeld = true;
                    let message = null;
                    function getMessage() {
                        return contentNode.textContent;
                    }
                    sendMessage(getMessage())
                    return;
                }
                else {
                    contentNode.style.setProperty("transition", `background ${Config.requiredHoldTime}ms ease`)
                    contentNode.style.background = "var(--seventv-highlight-neutral-1)"
                }
            }
            let startTime = 0
            function startHold() {
                stopHold();
                hasHeld = false;
                startTime = performance.now();
                requestAnimationFrame(whileHeld)
            }
            function stopHold() {
                if (whileHeldId) {
                    cancelAnimationFrame(whileHeldId)
                    startTime = 0;
                    whileHeldId = null
                    contentNode.style.setProperty("transition", `background ${Config.messageClickAnimationTime}ms ease`)
                    contentNode.style.background = ""
                }
            }
            contentNode.addEventListener("mousedown", startHold);
            ["mouseup", "mouseleave"].forEach(e => { contentNode.addEventListener(e, stopHold) });

            return new ContentNode(contentNode);
        }

        injectContentNodes() {
            let outerElement = document.querySelector(".effortlesschatting-messagebox-area");
            for (let i = 0; i < Config.contentNodeAmount; i++) {
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
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

            console.log("reactFiber ", reactFiber)
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

        waitForSevenTV() {
            let emotePicker = document.querySelector("[data-a-target='emote-picker-button']");
            function isLoaded() {
                if (document.body.querySelector("#seventv-message-container") && document.body.querySelector("#seventv-settings-button") && document.body.querySelector("aside#live-page-chat[aria-hidden='false']") && document.body.querySelector("#WYSIWGChatInputEditor_SkipChat") && document.body.querySelector(".seventv-emote-menu-button") && document.querySelector(".seventv-chat-input-container div.chat-input").childNodes[0].classList.length > 0) {
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
                child.innerText = null;
                if (this.printWrapper) {
                    this.node.removeEventListener("click", this.printWrapper);
                    this.printWrapper = null;
                }
            }
            this.node.classList.add("hidden");
        }

        displayOn(message) {
            let messageToAssociatedClass = message.srcset === "" ? "contentText" : "contentImg"
            let associatedChild = this.node.querySelector(`.${messageToAssociatedClass}`)
            associatedChild.innerText = message.text;
            associatedChild.srcset = message.srcset;
            associatedChild.classList.remove("hidden")
            this.node.classList.remove("hidden")
            this.printWrapper = function () {
                message.printToChat();
            }
            this.node.addEventListener("click", this.printWrapper)
        }

        static updateNodes() {
            if(!domManager || domManager.contentNodes.length == 0)
            {
                return
            }
            let topElements = messages.getTop(Config.contentNodeAmount);
            console.log("current top ", topElements)
            let isAnyMessageFound = false;
            for (let i = 0; i < Config.contentNodeAmount; i++) {
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
                if (Config.autoHide) {
                    document.querySelector(".effortlesschatting-no-message").classList.add("hidden");
                }
                else {
                    document.querySelector(".effortlesschatting-no-message").classList.remove("hidden");
                }
                document.querySelector(".effortlesschatting-messagebox-area").classList.add("hidden");
            }
        }

    }

    function subscriberMonthCalculator(badgeText) {
        let amount = parseFloat(badgeText.split("-"));
        if (badgeText.includes("-Year")) {
            return amount * 12
        }
        return amount
    }

    let chatListener = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                for (let message of mutation.addedNodes) {
                    domManager.scrape(message);
                }
                if (!domManager.isMouseOver()) {
                    ContentNode.updateNodes();
                }
            }
        }
    });

    
    let domManager = new DomManager();
    await domManager.waitForSevenTV();
    let chatEntry = document.querySelector("#live-page-chat #seventv-message-container main.seventv-chat-list")
    let messages = new MessageList();
    let textbox = document.querySelector("[role=textbox]")
    let hasText = function () { return textbox.textContent !== "\ufeff" }
    let textBoxControllers = domManager.getEditor();
    console.log(textBoxControllers)
    let sendMessage = domManager.getSendMessage();
    domManager.injectRoot();
    domManager.injectFlushButton();
    domManager.injectContentNodes();
    //domManager.scrapeAlreadySent();

    //if for some reason chat box gets removed we inject it
    function checkInjection() {

        const observer = new MutationObserver(async function () {
            console.log(domManager)
            if (domManager && document.querySelector(domManager.selectors.root) != null && document.querySelector(domManager.selectors.flush) != null && document.querySelectorAll(domManager.selectors.contentNodes).length != 0)
                return
            
            observer.disconnect()

            console.log("detected root disattachment")
            domManager = new DomManager();
            await domManager.waitForSevenTV();
            chatEntry = document.querySelector("#live-page-chat #seventv-message-container main.seventv-chat-list")
            messages = new MessageList();
            textbox = document.querySelector("[role=textbox]")
            hasText = function () { return textbox.textContent !== "\ufeff" }
            textBoxControllers = domManager.getEditor();
            console.log(textBoxControllers)
            sendMessage = domManager.getSendMessage();
            domManager.injectRoot();
            domManager.injectFlushButton();
            domManager.injectContentNodes();
            //domManager.scrapeAlreadySent();

            observer.observe(document, { childList: true, subtree: true })
        })

        observer.observe(document, { childList: true, subtree: true });
    }

    checkInjection();

    function findPathToTarget(startFiber, functionName) {
        const queue = [{ fiber: startFiber, path: [] }];
        const visited = new Set();

        while (queue.length > 0) {
            const { fiber, path } = queue.shift();
            if (!fiber || visited.has(fiber)) continue;
            visited.add(fiber);

            if (fiber.stateNode && fiber.stateNode[functionName]) {
                return { fiber, path, success: true };
            }

            const nextNodes = [
                { node: fiber.child, key: 'child' },
                { node: fiber.sibling, key: 'sibling' },
                { node: fiber.return, key: 'return' },
                { node: fiber.alternate, key: 'alternate' },
                { node: fiber.stateNode?._reactInternals, key: 'stateNode._reactInternals' }
            ];

            nextNodes.forEach(({ node, key }) => {
                if (node && !visited.has(node)) {
                    queue.push({ fiber: node, path: [...path, key] });
                }
            });
        }

        return { success: false };
    }

    let emotes = {}
    function scrapeOnEvent(messageData) {
        if ((!Config.scrapeMods && messageData.message.user.badges.moderator) || (!Config.scrapeVIPs && messageData.message.isVip) || (!Config.scrapeBots && messageData.message.user.badges.chatbot)) {
            return;
        }

        if (Config.scrapeOnlySubs) { //make sure chatbot is a actual thing
            if (messageData.message.isSubscriber && (Number(messageData.message.user.badges.Subscriber) < Config.scrapeSubsWithMinimumMonths)) {
                return
            }
        }

        if (Config.bannedUsers.includes(messageData.message.user.userName)) {
            return
        }

        let uniqueWordsInMessage = Array.from(new Set(messageData.message.body.trim().split(" ").filter(item => !Config.bannedWords.includes(item))))
        console.log(uniqueWordsInMessage);
        uniqueWordsInMessage.forEach(word => messages.add(new Message(word, "", emotes[word])));
    }

    function scannerMethod() {
        if (Config.scannerMethod === 0) {
            chatListener.observe(chatEntry, { childList: true, subtree: false });
        }
        if (Config.scannerMethod === 1) {
            let startElement = document.querySelector(".chat-room__content");
            let startFiber = startElement[Object.keys(startElement).find(item => item.includes("reactFiber"))]
            let functionName = "onChatMessageEvent"
            let fiber = findPathToTarget(startFiber, functionName).fiber
            let onChatMessageEvent = fiber.stateNode.onChatMessageEvent
            fiber.stateNode.onChatMessageEvent = function (...args) {
                if (args[0]) {
                    scrapeOnEvent(args[0])
                    if (!domManager.isMouseOver()) {
                        ContentNode.updateNodes()
                    }
                }
                return onChatMessageEvent.apply(this, args)
            }
        }
        if (Config.scannerMethod === 2) {
            let startElement = document.querySelector(".chat-room__content");
            let startFiber = startElement[Object.keys(startElement).find(item => item.includes("reactFiber"))]
            let functionName = "onChatMessageEvent"
            let fiber = findPathToTarget(startFiber, functionName).fiber
            let onChatMessageEvent = fiber.stateNode.onChatMessageEvent
            let scanEmotesFlag = { flag: false, param: null };
            fiber.stateNode.onChatMessageEvent = function (...args) {
                scanEmotesFlag = { flag: true, param: args[0] };
                return onChatMessageEvent.apply(this, args)
            }
            let insertBefore = Node.prototype.insertBefore
            Node.prototype.insertBefore = function (...args) {
                if (scanEmotesFlag.flag) {
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
                return insertBefore.apply(this, args);
            }
        }
        if (Config.scannerMethod === 3) {
            //combined method to work with other extensions
        }
        if (Config.scannerMethod === 4) {
            //"insert before" listener but listener gets activated by onChatMessageEvent
        }
    }
    scannerMethod()

    //
})()