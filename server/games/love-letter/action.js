import Card from './card.js';

/**
 * An abstract class to represent actions in the game LoveLetter.
 * The class is designed to be immutable.
 **/
export default class Action {

    card;
    player;
    target;
    guess;

    /**
     * Private constructor for creating a new action.
     * Called by the static play methods.
     * @param card the card being played
     * @param player the player performing the action
     * @param target the player targetted by this action, or the player in the event an action has no target
     * @param guess the card the player guesses in a guard action
     * @throws Error if an illegal action.
     **/
    constructor(card, player, target, guess) {
        if (player < 0 || player > 3) { throw new Error('Player out of range.'); }
        if (card == null) { throw new Error('Null card specified in action.'); }
        if (target < -1 || target > 3) { throw new Error('Player out of range.'); }
        this.card = card;
        this.player = player;
        this.target = target;
        this.guess = guess;
    }

    /**
     * produces a string representation of the action
     * @return a string representation of the action
     **/
    makeString(player, target) {
        let str = `Player ${player} played the ${this.card.name}`;
        switch (this.card) {
            case Card.GUARD: return str + ` and guessed player ${target} held the ${this.guess}.`;
            case Card.PRIEST: return str + ` and asked to see player ${target}'s card.`;
            case Card.BARON: return str + ` and challenged player ${target} .`;
            case Card.HANDMAID: return str + '.';
            case Card.PRINCE: return str + ` and asked player ${target} to discard.`;
            case Card.KING: return str + ` and asked player ${target} to swap cards.`;
            case Card.COUNTESS: return str + '.';
            case Card.PRINCESS: return str + '.';
            default: return str + '.';
        }
    }

    toString() {
        return this.makeString('' + this.player, '' + this.target);
    }

    /**
     * Constructs a GUARD action from the player guessing the targets card.
     * @param player the player performing the action
     * @param target the player taregtted by this action
     * @param guess the card the player guesses
     * @return the action object
     * @throws IllegalActionException if an illegal action.
     **/
    static playGuard(player, target, guess) {
        if (target === -1) { throw new Error('Target must be specified.'); }
        if (player === target) { throw new Error('A player cannot target themselves.'); }
        if (guess == null) { throw new Error('Player cannot guess a null card.'); }
        if (guess == 'GUARD') { throw new Error('Player cannot guess a guard.'); }
        return new Action(Card.GUARD, player, target, guess);
    }

    /**
     * Constructs a PRIEST action for the player seeing the targets card.
     * @param player the player performing the action
     * @param target the player targetted by this action
     * @return the action object
     * @throws IllegalActionException if an illegal action.
     **/
    static playPriest(player, target) {
        if (target === -1) { throw new Error('Target must be specified.'); }
        if (player === target) { throw new Error('A player cannot target themselves.'); }
        return new Action(Card.PRIEST, player, target, null);
    }

    /**
     * Constructs a BARON action for the player challenging another player.
     * @param player the player performing the action
     * @param target the player targetted by this action
     * @return the action object
     * @throws IllegalActionException if an illegal action.
     **/
    static playBaron(player, target) {
        if (target === -1) { throw new Error('Target must be specified.'); }
        if (player === target) { throw new Error('A player cannot target themselves.'); }
        return new Action(Card.BARON, player, target, null);
    }

    /**
     * Constructs a HANDMAID action for the player.
     * @param player the player performing the action
     * @return the action object
     **/
    static playHandmaid(player) {
        return new Action(Card.HANDMAID, player, -1, null);
    }

    /**
     * Constructs a PRINCE action for the player requiring 
     * the targetted player to discard their card and draw a new one.
     * @param player the player performing the action
     * @param target the player targetted by this action
     * @return the action ob
     * 
     * @throws Error if an illegal action.
     **/
    static playPrince(player, target) {
        if (target === -1) { throw new Error('Target must be specified.'); }
        return new Action(Card.PRINCE, player, target, null);
    }

    /**
     * Constructs a KING action for the player requiring 
     * swapping cards with the target.
     * @param player the player performing the action
     * @param target the player targetted by this action
     * @return the action object
     * @throws Error if an illegal action.
     **/
    static playKing(player, target) {
        if (target === -1) { throw new Error('Target must be specified.'); }
        if (player === target) { throw new Error('A player cannot target themselves.'); }
        return new Action(Card.KING, player, target, null);
    }

    /**
     * Constructs a COUNTESS action for the player.
     * @param player the player performing the action
     * @return the action object
     * @throws Error if the player is out of range
     **/
    static playCountess(player) {
        return new Action(Card.COUNTESS, player, -1, null);
    }

    /**
     * Constructs a PRINCESS action for the player.
     * @param player the player performing the action
     * @return the action object
     * @throws Error if the player is out of range
     **/
    static playPrincess(player) {
        return new Action(Card.PRINCESS, player, -1, null);
    }
}