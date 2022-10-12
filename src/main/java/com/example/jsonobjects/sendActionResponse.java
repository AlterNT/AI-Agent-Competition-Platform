package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class sendActionResponse {

    public final String agentToken;
    public final String gameID;
    public final Boolean success;

    public sendActionResponse(@JsonProperty("agentToekn") String agentToken, @JsonProperty("gameID") String gameID,
            @JsonProperty("success") Boolean success) {
        this.agentToken = agentToken;
        this.gameID = gameID;
        this.success = success;
    }
}
