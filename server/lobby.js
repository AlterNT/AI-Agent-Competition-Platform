class Lobby {
    constructor(playerCapacity, minCapacity, startLobby) {
        /** @type {String[]} */
        this.players = [];

        /** @type {Number} */
        this.playerCapacity = playerCapacity;

        /** @type {Number} */
        this.minCapacity = minCapacity;

        /** @type {Number} */
        this.timeoutDuration = 5000;

        this.startLobby = startLobby;
    }

    fillLobby() {
        // TODO: Pad lobby with random agents
    }

    isFull() {
        return this.players.length == this.playerCapacity;
    }

    registerPlayer(token) {
        this.players.push(token);
        if (this.players.length === this.minCapacity) {
            this.timeoutStart = new Date();
            setTimeout(() => {
                if (this.players.length !== this.playerCapacity) {
                    this.startLobby()
                }
            }, this.timeoutDuration);
        }

        if (this.players.length === this.playerCapacity) {
            this.
        }
    }
}
