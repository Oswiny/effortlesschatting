const reactFiberSelector = function (query) {
    const element = this.querySelector(query);
    const reactFiber = element[Object.keys(element)?.find(item => item.includes("reactFiber"))]
    return reactFiber
}

Element.prototype.reactFiberSelector = reactFiberSelector
Document.prototype.reactFiberSelector = reactFiberSelector


export function findPathToTarget(startFiber, targetName) {
    const queue = [{ fiber: startFiber, path: [] }];
    const visited = new Set();

    while (queue.length > 0) {
        const { fiber, path } = queue.shift();
        if (!fiber || visited.has(fiber)) continue;
        visited.add(fiber);

        if (fiber.stateNode) {
            if (fiber.stateNode[targetName]) {
                return {
                    fiber,
                    path,
                    success: true,
                };
            }

            if (fiber.stateNode.props && fiber.stateNode.props[targetName]) {
                return {
                    fiber,
                    path,
                    success: true,
                };
            }
        }
        const nextNodes = [
            { node: fiber.return, key: 'return' },
            { node: fiber.child, key: 'child' },
            { node: fiber.sibling, key: 'sibling' },
            { node: fiber.alternate, key: 'alternate' },
        ];

        nextNodes.forEach(({ node, key }) => {
            if (node && !visited.has(node)) {
                queue.push({ fiber: node, path: [...path, key] });
            }
        });
    }

    return { success: false };
}


