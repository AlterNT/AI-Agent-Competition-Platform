package javaclient;

import javaclient.loveletter.Action;
import javaclient.loveletter.Agent;
import javaclient.loveletter.IllegalActionException;
import javaclient.loveletter.State;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * 
 */
public class stateUpdater {

    private static Action playerAction;
    /**
     * 
     */
    private objectBuilder builder;

    /**
     * 
     */
    public stateUpdater() {
        this.builder = new objectBuilder();
    }

    /**
     * 
     * @param controller
     * @param state
     * @param action
     * @param agent
     * @throws IllegalActionException
     */
    public void updatePlayerState(State controller, JsonNode state, JsonNode action, Agent agent, State playerState)
            throws IllegalActionException {
        try {
            playerAction = builder.buildAction(action);
            State updatedPlayerState = builder.buildState(state, controller, playerState);
            if (playerAction == null) {
                agent.newRound(updatedPlayerState);
            } else {
                agent.see(playerAction, updatedPlayerState);
            }
        } catch (IllegalActionException e) {
            throw e;
        }
    }

    public State updateControllerState(State controller, JsonNode state, JsonNode action, State playerState)
            throws IllegalActionException {
        State updatedControllerState;
        try {
            updatedControllerState = builder.buildControllerState(state, controller, playerState);
        } catch (IllegalActionException e) {
            throw e;
        }
        return updatedControllerState;
    }

}
