package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class gameFinished {

    public final Boolean gameFinished;

    public gameFinished(@JsonProperty("gameFinished") Boolean gameFinished) {
        this.gameFinished = gameFinished;
    }

}
