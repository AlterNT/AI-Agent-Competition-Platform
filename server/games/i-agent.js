class IAgent {
    /** @type {String} The token of the current agent. */
    token;
    /** @type {{token: String, event: String, args: []}[]} Agent event record */
    events = [];

    constructor(token) {
        this.token = token;
    }
}

export default IAgent;