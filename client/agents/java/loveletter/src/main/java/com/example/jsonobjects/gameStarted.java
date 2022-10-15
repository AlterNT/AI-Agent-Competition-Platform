package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class gameStarted {
    public final String agentToken;
    public final Boolean gameStarted;

    public gameStarted(@JsonProperty("agentToken") String agentToken,
            @JsonProperty("gameStarted") Boolean gameStarted) {
        this.agentToken = agentToken;
        this.gameStarted = gameStarted;
    }

    public Boolean started() {
        return this.gameStarted;
    }

}
