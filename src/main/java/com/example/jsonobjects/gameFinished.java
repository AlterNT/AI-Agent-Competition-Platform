package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class gameFinished {

    public final String agentToken;
    public final String gameID;
    public final Boolean gameFinished;

    public gameFinished(@JsonProperty("agentToekn") String agentToken, @JsonProperty("gameID") String gameID,
            @JsonProperty("gameFinished") Boolean gameFinished) {
        this.agentToken = agentToken;
        this.gameID = gameID;
        this.gameFinished = gameFinished;
    }

}
