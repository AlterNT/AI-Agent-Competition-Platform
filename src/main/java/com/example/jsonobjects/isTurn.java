package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class isTurn {

    public final String agentToken;
    public final String gameID;
    public final Boolean isTurn;

    public isTurn(@JsonProperty("agentToekn") String agentToken, @JsonProperty("gameID") String gameID,
            @JsonProperty("isTurn") Boolean isTurn) {
        this.agentToken = agentToken;
        this.gameID = gameID;
        this.isTurn = isTurn;
    }

}
