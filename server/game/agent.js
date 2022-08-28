export default class Agent {
    /** @abstract @type {String|Number} */
    // Agents get token strings, while bots get their index number.
    token;

    constructor(token) {
        this.token = token;
    }
}