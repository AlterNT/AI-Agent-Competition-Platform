package com.example;

import com.example.loveletter.Action;
import com.example.loveletter.Card;
import com.example.loveletter.State;
import com.fasterxml.jackson.databind.JsonNode;

public class objectBuilder {

    public objectBuilder() {

    }

    public State buildState(JsonNode json, State controller) {
        // JsonNode data = state.get();
        // int player = data.get("player").intValue();
        // int num = data.get("num").intValue();
        String[][] discards = new String[4][16];
        return null;
    }

    public Card buildCard(JsonNode json) {
        return null;
    }

    public Action buildAction(JsonNode json) {
        return null;
    }
}
