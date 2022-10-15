package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class joinLobby {

    public final String agentToken;
    public final String gameID;
    public final Boolean success;

    public joinLobby(@JsonProperty("agentToken") String agentToken, @JsonProperty("gameID") String gameID,
            @JsonProperty("success") Boolean success) {
        this.agentToken = agentToken;
        this.gameID = gameID;
        this.success = success;
    }

    public Boolean success() {
        return this.success;
    }
}
