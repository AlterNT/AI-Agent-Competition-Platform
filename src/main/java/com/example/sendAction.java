package com.example;

import com.fasterxml.jackson.annotation.JsonProperty;

public class sendAction {

    public final String agentToken;
    public final String gameID;
    public final Boolean success;

    public sendAction(@JsonProperty("agentToekn") String agentToken, @JsonProperty("gameID") String gameID,
            @JsonProperty("success") Boolean success) {
        this.agentToken = agentToken;
        this.gameID = gameID;
        this.success = success;
    }
}
