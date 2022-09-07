import Card from './card.js'
import Action from './card.js'
import State from './state.js'

/**
 * An interface for representing an agent in the game Love Letter
 * All agents must have a 0 parameter constructor
 * */
class Agent {
    /**
     * Method called at the start of a round
     * @param start the initial state of the round
     **/
    newRound(state) {}

    /**
     * Method called when any agent performs an action. 
     * @param action the action an agent performs
     * @param state the state of play the agent is able to observe.
     * **/
    see(action, state) {}

    /**
     * Perform an action after drawing a card from the deck
     * @param card the card drawn from the deck
     * @return the action the agent chooses to perform
     * @throws IllegalActionException when the Action produced is not legal.
     * */
    playCard(card) {
        return Action
    }
}

export default Agent