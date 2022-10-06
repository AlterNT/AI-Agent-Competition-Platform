package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class gameStarted {
    public final Boolean gameStarted;

    public gameStarted(@JsonProperty("gameStarted") Boolean gameStarted) {
        this.gameStarted = gameStarted;
    }

}
