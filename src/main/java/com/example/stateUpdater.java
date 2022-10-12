package com.example;

import com.example.loveletter.Action;
import com.example.loveletter.Agent;
import com.example.loveletter.IllegalActionException;
import com.example.loveletter.State;
import com.fasterxml.jackson.databind.JsonNode;

public class stateUpdater {

    private objectBuilder builder;

    public stateUpdater() {
        this.builder = new objectBuilder();
    }

    public void updatePlayerState(State controller, JsonNode state, JsonNode action, Agent agent)
            throws IllegalActionException {
        Action playerAction = builder.buildAction(action);
        State playerState = builder.buildState(state, controller);
        agent.see(playerAction, playerState);
    }

}
