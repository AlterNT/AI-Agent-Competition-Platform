import child_process from child_process

class Lobby {
    constructor(agentToken, gameID) {
        this.agents = [agentToken]
        this.gameID = gameID
        this.game = null
    }

    startGame() {
        this.game = child_process.spawn(['bash', `./games/${gameID}/start.sh`])
    }
}