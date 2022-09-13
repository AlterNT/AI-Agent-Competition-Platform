import Card from './card.js'

/**
 * This class represents the observable state of the game.
 * The class comes in two modes, one for the players, which has update operations disabled,
 * and one for the game engine, that can update the state.
 * States of players in the same game will have common data, allowing for an efficient representation.
 **/
class State {
    /** @type {Integer} the player who observes this outcome, or -1 for the game engine */
    player

    /** @type {Integer} The number of players in the game */
    num

    /** @type {Array, Array, Card} the discarded cards or each player */
    discards

    /** @type {Array, Integer} how many cards each player has discarded */
    discardCount

    /** @type {Array, Card} the cards players currently hold, or null if the player has been eliminated */
    hand

    /** @type {Array, Card} the deck of remaining cards */
    deck

    /** @type {Array, Integer} the index of the top of the deck */
    top

    /** @type {Array, Array, Boolean} whether player knows another players card */
    known

    /** @type {Array, Boolean} */
    handmaid

    /** @type {Array, Integer} the current score of each player */
    scores

    /** @type {Array, Integer} */
    random

    /** @type {Array, Integer} the index of the next player to draw a card (using Object reference so value is shared). */
    nextPlayer

    /** @type {Array, Agents} */
    agents

    /**
     * Default constructor to build the initial observed state for a player
     * First player in the array will always start
     * @param random the random number generator for the deals.
     * @param agents the array of players who start the game (must be of size 2,3 or 4)
     * @throws IllegalArgumentException if the array is of the wrong size.
     **/
    constructor(random, agents) {
        this.random = random
        this.num = agents.length
        if (this.num < 2 || this.num > 4) {
            throw new Error("incorrect number of agents")
        }
        this.agents = agents
        this.player = -1
        this.scores = new Array(this.num).fill(0)
        try {
            this.newRound();
        } catch { }
        this.nextPlayer = [0]
    }

    /**
     * Resets state for a new round, with new deck of cards, 
     * and everyone's hand and discards reset.
     * @throws IllegalActionException if this is a player state.
     **/
    newRound() {
        if (this.player != -1) { throw new Error("Operation not permitted in player's state.") }
        this.deck = Card.createDeck(this.random)
        this.discards = new Array(this.num)
        for (let i = 0; i < this.num; i++) {
            this.discards[i] = new Array(16)
        }
        this.discardCount = new Array(this.num)
        this.hand = new Array(this.num)
        this.handmaid = new Array(this.num)
        this.top = [0]
        this.known = new Array(this.num)
        for (let i = 0; i < this.num; i++) {
            this.known[i] = new Array(this.num)
        }
        for (let i = 0; i < this.num; i++) {
            this.hand[i] = this.deck[this.top[0]++]
            this.known[i][i] = true
        }
    }

    /**
     * Produces a state object for a player in the game.
     * The update methods will be disabled for that State object.
     * @param player the player for who the State object is created.
     * @throws IllegalActionException if this is a player state.
     * @throws IllegalArgumentException if player is not between 0 and numPlayers
     **/
    playerState(player) {
        if (this.player != -1) { throw new Error("Operation not permitted in player's state.") }
        if (player < 0 || this.num <= player) { throw new Error("Player out of range.") }
        try {
            let state = Object.assign(new State(this.random, this.agents), this)
            state.player = player;
            return state
        } catch (e) {
            console.error(e)
            return null
        }
    }

    /**
     * checks to see if agent a targetting agent t, with card c, whilst holding card d is a legal action.
     * That is 
     * a) the player a must hold card c, 
     * b) it must be player a's turn
     * c) if the player holds the Countess, they cannot play the Prince or the King
     * d) if the action has a target, they cannot be eliminated
     * e) if the target is protected by the Handmaid and their is some player other than the target and a not protected, 
     *    then that player must be targetted instead. 
     * f) if all players are protected by the Handmaid and the player a plays a Prince, they must target themselves
     * @param a the index of the playing agent
     * @param t the index of the targeted player or -1, of no such target exists
     * @param c the card played 
     * @param drawn the card drawn
     * @throws IllegalActionException if any of these conditions hold.
     **/      
    isLegalAction(a, t, c, drawn) {
        if (this.hand[a] != c && drawn != c) {
            throw new Error("Player does not hold the played card")
        }
        if (this.nextPlayer[0] != a) {
            throw new Error("Wrong player in action")
        }
        if ((this.hand[a].name === "Countess" || drawn.name === "Countess") && (c.name === "King" || c.name === "Prince")) {
            throw new Error("Player must play the countess")
        }
        if (t != -1) {
            if (this.eliminated(t)) {
                throw new Error("The action's target is already eliminated")
            }
            if (c.name === "Prince" && a === t) {
                return
            }
            if (this.playerHandmaid(t) && (!this.allHandmaid(a) || c.name === "Prince")) {
                throw new Error("The action's target is protected by the handmaid");
            }
        }
    }

    /**
     * Checks to see if an action is legal given the current state of the game, for an agent who has just drawn a card.
     * That is 
     * a) the player a must hold card c, 
     * b) it must be player a's turn
     * c) if the player holds the Countess, they cannot play the Prince or the King
     * d) if the action has a target, they cannot be eliminated
     * e) if the target is protected by the Handmaid and their is some player other than the target and a not protected, 
     *    then that player must be targetted instead. 
     * f) if all players are protected by the Handmaid and the player a plays a Prince, they must target themselves
     * There are other rules (such as a player not targetting themselves) that is enforced in the Action class.
     * @param act the action to be performed
     * @param drawn the card drawn by the playing agent.
     * @throws IllegalActionException if any of these conditions hold.
     **/ 
    legalAction(act, drawn) {
        if (act === null) { return false }
        try {
            this.isLegalAction(act.player, act.target, act.card, drawn)
        } catch { return false }
        return true
    }

    /**
     * Draws a card for a player from the shuffled deck. May only be performed in the game state.
     * The card is no longer available on the top of the deck. 
     * @return the top card of the deck
     * @throws IllegalActionException if an agent attempts to access this from a player state.
     **/
    drawCard() {
        if (this.player != -1) { throw new Error("operation not permitted in player's state.") }
        return this.deck[this.top[0]++];
    }

    /**
     * Executes the given action of a player.
     * May only be called for non-player states (i.e. the omniscient game engine state)
     * @param act the action to be performed
     * @param card the card drawn by the actor
     * @return a plain English description of the action
     * @throws IllegalActionAxception if the state is a player state, or if the action is against the rules. 
     **/
    update(act, card) {
        if (this.player != -1) {
            throw new Error("Method cannot be called from a player state");
        }
        const a = act.player;
        const t = act.target;
        const c = act.card;
        this.discards[a][this.discardCount[a]++] = c

        try {
            this.legalAction(a, t, c, card)
        } catch (e) {
            this.discardCount[a]--
            throw e
        }
        
        if (c == this.hand[a]) {
            this.hand[a] = card
            for (let i = 0; i < this.num; i++) {
                if (i != a) {
                    this.known[i][a] = false
                }
            }
        }

        this.handmaid[a] = false
        let ret = t != -1 ? this.name(t) : ""

        switch (c.name) {
            case Card.GUARD.name:
                ret += this.guardAction(a, t, act.guess)
                break
            case Card.PRIEST.name:
                ret += this.priestAction(a, t)
                break
            case Card.BARON.name:
                ret += this.baronAction(a, t)
                break
            case Card.HANDMAID.name:
                this.handmaid[a] = true
                break
            case Card.PRINCE.name:
                ret += this.princeAction(t)
                break
            case Card.KING.name:
                ret += this.kingAction(a, t)
                break
            case Card.COUNTESS.name:
                break
            case Card.PRINCESS.name:
                ret += this.princessAction(a)
                break
            default:
                throw new Error("Illegal Action? Something's gone very wrong")
        }

        if (this.roundOver()) {
            for (let i = 0; i < this.num; i++) {
                for (let j = 0; j < this.num; j++) {
                    this.known[i][j] = true
                }
            }

            const winner = this.roundWinner()
            ret += "\nPlayer " + winner + " wins the round."
            this.scores[winner]++
            this.nextPlayer[0] = winner
        }
        else {
            this.nextPlayer[0] = (this.nextPlayer[0] + 1) % this.num;
            while (this.eliminated(this.nextPlayer[0])) {
                this.nextPlayer[0] = (this.nextPlayer[0] + 1) % this.num;
            }
        }
        return ret
    }

    guardAction(a, t, guess) {
        if (this.allHandmaid(a)) { return "\nPlayer " + this.name(t) + " is protected by the Handmaid.\n" }
        else if (guess === this.hand[t]) {
            this.discards[t][this.discardCount[t]++] = this.hand[t]
            this.hand[t] = null
            for (let i = 0; i < this.num; i++) { this.known[i][t] = true }
            return "\nPlayer " + this.name(t) + " had the " + guess + " and is eliminated from the round\n"
        }
        else {
            return "\nPlayer " + this.name(t) + " does not have the " + guess + "\n"
        }
    }

    priestAction(a, t) {
        if (this.allHandmaid(a)) { return "\nPlayer " + this.name(t) + " is protected by the Handmaid.\n" } 
        else { this.known[a][t] = true }
        return "\nPlayer " + this.name(a) + " sees player " + this.name(t) + "'s card.\n"
    }

    baronAction(a, t) {
        if (this.allHandmaid(a)) { return "\nPlayer " + this.name(t) + " is protected by the Handmaid.\n" }
        let elim = -1
        if (this.hand[a].value > this.hand[t].value) { elim = t }
        else if (this.hand[a].value < this.hand[t].value) { elim = a }
        if (elim != -1) {
            this.discards[elim][this.discardCount[elim]++] = this.hand[elim]
            this.hand[elim] = null
            for (let i = 0; i < this.num; i++) { this.known[i][elim] = true }
            return "\nPlayer " + this.name(elim) + " holds the lesser card: " + this.discards[elim][this.discardCount[elim] - 1].name + ", and is eliminated\n"
        }
        this.known[a][t] = true
        this.known[t][a] = true
        return "\n Both players hold the same card, and neither is eliminated.\n"
    }

    princeAction(t) {
        const discarded = this.hand[t]
        this.discards[t][this.discardCount[t]] = this.discarded
        if (discarded.name === "Princess") {
            this.hand[t] = null
            for (let i = 0; i < this.num; i++) { this.known[i][t] }
            return `\nPlayer ${this.name(t)} discarded the Princess and is eliminated.\n`
        }
        this.hand[t] = this.deck[this.top[0]++]
        for (let i = 0; i < this.num; i++) {
            if (i != t) {
                this.known[i][t] = false
            }
        }

        return `\nPlayer ${this.name(t)} discards the ${discarded.name}.\n`
    }


    kingAction(a, t) {
        if (this.allHandmaid(a)) { return "\nPlayer " + this.name(t) + " is protected by the Handmaid.\n" }
        this.known[a][t] = true
        this.known[t][a] = true
        for (let i = 0; i < this.num; i++) {
            if (i != t && i != a) {
                let tmp = this.known[i][t]
                this.known[i][t] = this.known[i][a]
                this.known[i][a] = tmp
            }
        }
        const temp = this.hand[a]
        this.hand[a] = this.hand[t]
        this.hand[t] = temp
        return "\nPlayer " + this.name(a) + " and player " + this.name(t) + " swap cards.\n"
    }

    princessAction(a) {
        const discarded = this.hand[a]
        this.discards[a][this.discardCount[a]++] = discarded
        this.hand[a] = null
        for (let i = 0; i < this.num; i++) { this.known[i][a] = true }
        let outcome = "\nPlayer " + this.name(a) + " played the Princess and is eliminated.\n"
        outcome += "\n Player " + this.name(a) + " was also holding the " + this.discards[a][this.discardCount[a] - 1] + ".\n"
        return outcome
    }

    /**
     * returns the index of the observing player, or -1 for perfect information.
     * @return the index of the observing player, or -1 for perfect information.
     **/
    getPlayerIndex() {
        return this.player;
    }

    /**
     * get the card of the specified player, if known.
     * @param playerIndex the player for which we seek the card
     * @return the card the player currently holds, or null, if it is not known
     * @throws ArrayIndexoutOfBoundsException if the playerIndex is out of range.
     **/
    getCard(playerIndex) {
        if (this.player == -1 || this.known[this.player][playerIndex]) { return this.hand[playerIndex] }
        else { return null }
    }

    /**
     * returns true if the nominated player is eliminated in the round
     * @param player the player being checked
     * @return true if and only if the player has been eliminated in the round.
     * @throws ArrayIndexoutOfBoundsException if the playerIndex is out of range.
     **/
    eliminated(player) {
        return this.hand[player] == null
    }

    /**
     * Gives the next player to play in the round
     * @return the index of the next player to play
     **/
    getNextPlayer() {
        return this.nextPlayer[0]
    }

    /**
     * helper method to determine if the nominated player is protected by the handmaid
     * @return true if and only if the index corresponds to a player who is protected by the handmaid
     **/
    playerHandmaid(player) {
        if (player < 0 || player >= this.num) { return false }
        return this.handmaid[player]
    }

    /**
     * helper method to check if every other player other than the specified player is either eliminated or protected by the handmaid
     * @param player the player who would be playing a card
     * @return true if and only if every player other than the nominated player is eliminated or prtoected by the handmaid
     * @throws ArrayIndexoutOfBoundsException if the playerIndex is out of range.
     **/
    allHandmaid(player) {
        let noAction = true
        for (let i = 0; i < this.num; i++) {
            noAction = noAction && (this.eliminated(i) || this.handmaid[i] || i === player)
        }
        return noAction
    }

    name(playerIndex) {
        return this.agents[playerIndex].name + "(" + playerIndex + ")"
    }

    /**
     * gives the remaining size of the deck, including the burnt card
     * @return the number of cards not in players hands or discarded.
     **/
    deckSize() { return 16 - this.top[0]; }

    /**
     * returns an array of the remaining cards that haven't been played yet.
     * Should be called unplayedCards???
     * @return an array of all cards not in the discard piles
     **/
    unseenCards() {
        let alive = 0
        for (let i = 0; i < this.num; i++) {
            if (!this.eliminated(i)) alive++
        }
        let rem = new Array(this.deckSize() + alive)
        let aCount = 0
        for (let j = 0; j < this.num; j++) {
            if (!this.eliminated(j)) rem[aCount++] = this.hand[j]
        }
        for (let p = 0; p < this.deckSize(); p++) rem[alive + i] = this.deck[this.top[0] + i]
        rem.sort()
        return rem
    }

    /**
     * Tests to see if the round is over, either by all but one player being eliminated
     * or by all but one card being drawn from the deck.
     * @return true if and only if the round is over
     **/
    roundOver() {
        let remaining = 0
        for (let i = 0; i < this.num; i++) {
            if (!this.eliminated(i)) remaining++
        }
        return remaining == 1 || this.deckSize() < 2
    }

    /**
     * helper method to determine the winner of the round.
     * In the unlikely event of a total draw, 
     * the player with the smallest index is the winner.
     * @return the index of the winner, or -1 if the round is not yet over.
     **/ 
    roundWinner() {
        if (!this.roundOver()) { return -1 }
        let winner = -1
        let topCard = -1
        let discardValue = -1
        for (let p = 0; p < this.num; p++) {
            if (!this.eliminated(p)) {
                let dv = 0
                for (let j = 0; j < this.discardCount[p]; j++) { dv += this.discards[p][j].value }
                if (this.hand[p].value > topCard || (this.hand[p].value == topCard && dv > discardValue)) {
                    winner = p
                    topCard = this.hand[p].value
                    discardValue = dv
                }
            }
        }
        return winner
    }

    /**
     * returns the score of the specified player
     * @param player the player whose score is sought
     * @return the score of the specified player
     **/
    score(player) {
        if (player < 0 || player > this.num) { return 0 }
        return this.scores[player]
    }

    /**
     * confirms the game is over
     * @return true if and only if a player a acrued sufficient tokens to win the game
     **/
    gameOver() { return this.gameWinner() != -1; }

    /**
     * Gives the index of the winning player if there is one, otherwise returns -1
     * @return the index of the winning player, or -1 if the game is not yet over.
     **/
    gameWinner() {
        let threshold = this.num == 4 ? 4 : this.num == 3 ? 5 : this.num == 2 ? 7 : 0
        for (let i = 0; i < this.num; i++) {
            if (this.scores[i] === threshold) { return i }
        }
        return -1
    }
}

export default State