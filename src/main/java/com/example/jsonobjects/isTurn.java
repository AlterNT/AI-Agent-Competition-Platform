package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class isTurn {

    public final String agentToken;
    public final Boolean isTurn;

    public isTurn(@JsonProperty("agentToekn") String agentToken,
            @JsonProperty("isTurn") Boolean isTurn) {
        this.agentToken = agentToken;
        this.isTurn = isTurn;
    }

    public Boolean turn() {
        return this.isTurn;
    }
}
