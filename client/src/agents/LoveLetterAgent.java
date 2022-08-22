package agents;

import java.util.Random;

public class LoveLetterAgent {

    private Random random;
    private Object state;

    // 0 place default constructor
    public LoveLetterAgent() {
        random = new Random();
    }

    /**
     * Method called at the start of a round
     * 
     * @param start the starting state of the round
     **/
    public void newRound(Object start) {
        state = start;
    }

    /**
     * Method called when any agent performs an action.
     * 
     * @param act     the action an agent performs
     * @param results the state of play the agent is able to observe.
     **/
    public void see(Object action, Object results) {
        state = results;
    }

    /**
     * Perform an action after drawing a card from the deck
     * 
     * @param c the card drawn from the deck
     * @return the action the agent chooses to perform
     * @throws IllegalActionException when the Action produced is not legal.
     */
    public Object playCard(String card) {
        Object action = null;

        switch (card) {
            case "GUARD":
                break;
            case "PRIEST":
                
                break;
            case "BARON":
                
                break;
            case "HANDMAID":
                
                break;
            case "PRINCE":
                
                break;
            case "KING":
                
                break;
            case "COUNTESS":
                
                break;
            default:
                action = null;// never play princess
        }

        return action;
    }
}
