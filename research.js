let startElement = document.querySelector(".chat-room__content");
let startFiber = startElement[Object.keys(startElement).find(item => item.includes("reactFiber"))]
let functionName = "onChatMessageEvent"

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

let fiber = findPathToTarget(startFiber, functionName).fiber
let onChatMessageEvent = fiber.stateNode.onChatMessageEvent

fiber.stateNode.onChatMessageEvent = function (...args) {
    if (args[0]) {
        console.log(args[0])
    }
    onChatMessageEvent.apply(this, args)
}

//--------------------------------------------------------//
calls = []
const originalInsertBefore = Node.prototype.insertBefore;
Node.prototype.insertBefore = function (...args) {
    if (args[0].className && typeof args[0].className === "string" && args[0].className.includes("seventv-user-message")) {
        calls.push(args[0])
    }
    originalInsertBefore.apply(this, args)
}
//-------------------------------------------------------//
let list = []
document.querySelectorAll("*").forEach(
    item => {
        if (Object.keys(item).some(key => { key.toLowerCase().contains("vue") })) {
            list.push(item)
        }
    }
)


shortest = null
instances.forEach(item => {
    let result = findPathToTarget(item[Object.keys(item).find(el => el.includes("Fiber"))], functionName)
    if (!shortest && result.success) {
        shortest = result
    }
    else if (result.success && result.path && result.path.length < shortest.path.length) {
        shortest = result
        console.log("new shortest ", item)
    }
})

instances = [];
document.querySelectorAll('*').forEach(el => {
    if (Object.keys(el).some(item => item.toLowerCase().includes("__") && item.toLowerCase().includes("fiber"))) {
        instances.push(el);
    }
});
