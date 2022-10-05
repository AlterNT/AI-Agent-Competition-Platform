package com.example;

import com.fasterxml.jackson.annotation.JsonProperty;

public class getState {

    public final String agentToken;
    public final String gameID;
    public final Object state;

    public getState(@JsonProperty("agentToekn") String agentToken, @JsonProperty("gameID") String gameID,
            @JsonProperty("success") Object state) {
        this.agentToken = agentToken;
        this.gameID = gameID;
        this.state = state;
    }
}
