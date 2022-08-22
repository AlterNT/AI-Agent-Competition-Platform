class Lobby {
    constructor(playerCapacity, minCapacity) {
        /** @type {String[]} */
        this.players = [];

        /** @type {Number} */
        this.playerCapacity = playerCapacity;

        /** @type {Number} */
        this.minCapacity = minCapacity;

        /** @type {Number} */
        this.timeoutPeriod = 5000; // ms

        /** @type {undefined | Date} */
        this.timeoutStart;
    }

    isFull() {
        return this.players.length == this.playerCapacity;
    }

    registerPlayer(token) {
        this.players.push(token);
        if (this.playerCapacity === this.minCapacity) {
            this.timeoutStart = new Date();
        }
    }

    timedOut() {
        if (this.playerCapacity >= this.minCapacity && this.timeoutStart) {
            const now = new Date();
            const durationElapsed = now - timeoutStart;
            return durationElapsed > this.timeoutPeriod
        } {
            return false;
        }
    }
}
