import { findPathToTarget } from "./internalTraversalHandler.js";

const provider = Object.freeze({
    "seventv": "7tv",
    "ffz": "frankerfacez",
    "bttv": "betterttv"
})

function getLoginFromPage() {
    return window.location.pathname.split('/')[1]?.toLowerCase()
}

async function getTwitchID(login) {
    const res = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${login}`);
    if (!res.ok) return
    const json = await res.json();
    return json[0]?.id;
}

const accessors = {
    "7tv": (json) => {
        return (json.emotes ?? json.emote_set?.emotes ?? []);
    },
    "frankerfacez": (json) => {
        return (Object.values(json.sets || {}).find(item => item.emoticons)?.emoticons ?? Object.values(json.sets || {}).find(item => item.title === "Global Emotes")?.emoticons ?? [])
    },
    "betterttv": (json) => {
        return (json.channelEmotes || json.sharedEmotes) ? [...(json.channelEmotes ?? []), ...(json.sharedEmotes ?? [])] : (json ?? [])
    }
}

async function fetchFromURL(provider, url) {
    const accessor = accessors[provider]
    try {
        const res = await fetch(url)
        if (!res.ok) return [];
        const json = await res.json()
        return accessor(json);
    }
    catch (error) {
        console.error(error.message)
        return []
    }
}


const providerToURL = {
    "7tv": (id = null) => {
        if (id) return `https://7tv.io/v3/users/twitch/${id}`
        return "https://7tv.io/v3/emote-sets/global"
    },
    "frankerfacez": (id = null) => {
        if (id) return `https://api.frankerfacez.com/v1/room/id/${id}`
        return "https://api.frankerfacez.com/v1/set/global"
    },
    "betterttv": (id = null) => {
        if (id) return `https://api.betterttv.net/3/cached/users/twitch/${id}`
        return "https://api.betterttv.net/3/cached/emotes/global"
    }
}

async function fetchFromProvider(provider, id = null) {
    const url = providerToURL[provider](id)
    let emotes = await fetchFromURL(provider, url)
    if (Object.keys(emotes).length === 0) return {}
    emotes = standardizeEmotes[provider](emotes)
    return emotes
}

const standardizeEmotes = {
    "7tv": (emotes) => {
        let standardizedEmotes = {};
        emotes?.forEach(emote => {
            const name = emote.name;
            const srcset = Object.values(emote.data?.host?.files).filter(item => item.name.includes("avif")).map(item => `${emote?.data?.host?.url}/${item.name} ${item.name.split(".")[0]}`).join(", ")
            standardizedEmotes[name] = srcset;
        })
        return standardizedEmotes
    },
    "frankerfacez": (emotes) => {
        let standardizedEmotes = {};
        emotes?.forEach(emote => {
            const name = emote.name;
            const srcset = Object.entries(emote.urls)?.map(([key, url]) => `${url} ${key}x`).join(", ");
            standardizedEmotes[name] = srcset;
        })
        return standardizedEmotes
    },
    "betterttv": (emotes) => {
        let standardizedEmotes = {}
        const sizes = ["1x", "2x", "3x"]
        emotes?.forEach(emote => {
            const name = emote.code;
            standardizedEmotes[name] = sizes.map(size => `https://cdn.betterttv.net/emote/${emote.id}/${size} ${size}`).join(", ")
        })
        return standardizedEmotes
    },
    "native": (emotes) => {
        let standardizedEmotes = {};
        const sizes = ["1.0", "2.0", "3.0"]
        Object.values(emotes).forEach(emote => {
            const name = emote.token;
            standardizedEmotes[name] = sizes.map(size => `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/${size} ${size === "3.0" ? "4" : Math.floor(Number(size))}x`).join(", ")
        })
        return standardizedEmotes
    }
}

export async function getAllCustomEmotes() {
    const id = await getTwitchID(getLoginFromPage())
    const results = (await Promise.allSettled([
        fetchFromProvider(provider.seventv),
        fetchFromProvider(provider.seventv, id),
        fetchFromProvider(provider.ffz),
        fetchFromProvider(provider.ffz, id),
        fetchFromProvider(provider.bttv),
        fetchFromProvider(provider.bttv, id)
    ]));

    return results.filter(result => result.status === "fulfilled").reduce((accumulator, result) => {
        return Object.assign(accumulator, result.value);
    }, {});
}

export function getAllNativeEmotes() {
    const startFiber = document.reactFiberSelector(".chat-room__content")
    const fiber = findPathToTarget(startFiber, "emoteSetsData").fiber;
    const emotes = fiber.stateNode.props.emoteSetsData.emoteMap
    return standardizeEmotes["native"](emotes);
}

export async function getAllEmotes() {
    const results = await Promise.all([
        getAllCustomEmotes(),
        getAllNativeEmotes()
    ]);
    return results.reduce((accumulator, result) => {
        return Object.assign(accumulator, result)
    })
}