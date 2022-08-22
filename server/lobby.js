class Lobby {
    constructor(playerCapacity, minCapacity, dispatchGame) {
        /** @type {String[]} */
        this.players = [];

        /** @type {Number} */
        this.playerCapacity = playerCapacity;

        /** @type {Number} */
        this.minCapacity = minCapacity;

        /** @type {Number} */
        this.timeoutDuration = 5000;

        this.dispatchGame = dispatchGame;
    }

    startLobby() {
        // TODO
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
                    this.dispatchGame()
                }
            }, this.timeoutDuration);
        }

        if (this.players.length === this.playerCapacity) {
            this.
        }
    }
}
