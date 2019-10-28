export default {
    cache: {
        settings: 1000 * 90,
    },
    priority: {
        highest: -1000,
        high: -500,
        neutral: 0,
        low: 500,
        lowest: 1000,
    },
    Plugin: {
        prematureCallError: callName =>
            `${callName} called before ready. Wait for Plugin.register() promise to be resolved.`,
    },
};
