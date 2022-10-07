package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

public class getState {

    public final JsonNode state;

    public getState(@JsonProperty("success") JsonNode state) {
        this.state = state;
    }

    public JsonNode get() {
        return this.state;
    }
}
