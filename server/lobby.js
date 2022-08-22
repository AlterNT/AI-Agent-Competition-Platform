import Server from "./index.js";

export default class Lobby {

    /** @type {Game} */
    game;
    /** @type @todo? how are we going to represent agents. Tokens? */
    players = [];

    /**
     * @returns {Boolean} If the game is full.
     */
    isFull() {
        return this.players.length === Server.instance.Game.maxPlayers;
    }


    registerPlayer(id) { }
    // add player class access for lobby and gmae state management.

    // update database on stats post game
}

class Player {
    constructor(id) {
        //id
        //lobbyaddress
        //check if players id is registred in database, if not call function to register
    }
    // access functions

    // database addition functions 

    // database query functions 

}
