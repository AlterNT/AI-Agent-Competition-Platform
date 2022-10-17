class IAgent {
    /** @type {String} The token of the current agent. */
    token;
    /** @type {Function} Action resolver */
    pending;

    constructor(token) {
        this.token = token;
    }

    /**
     * Creates a new promise to await agent action.
     * Timeouts if action is not received within time limit.
     * @param {Number} timeout the limit in ms.
     * @returns Action received from agent or null if timeout is exceeded.
     */
    async awaitEvent(timeout = 10000) {
        const pending = new Promise((resolve) => {
            this.resolve = resolve;
        });

        const timer = setTimeout(() => {
            this.resolve(null)
        }, timeout)

        const result = await pending;
        clearTimeout(timer);

        return result;
    }
}

export default IAgent;