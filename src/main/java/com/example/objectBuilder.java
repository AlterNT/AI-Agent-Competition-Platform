package com.example;

import com.example.jsonobjects.getCard;
import com.example.jsonobjects.getState;
import com.example.loveletter.Action;
import com.example.loveletter.Card;
import com.example.loveletter.State;
import com.fasterxml.jackson.databind.JsonNode;

public class objectBuilder {

    public objectBuilder() {

    }

    public State buildState(getState state) {
        JsonNode data = state.get();
        int player = data.get("player").intValue();
        int num = data.get("num").intValue();
        String[][] discards = new String[4][16];
        return null;
    }

    public Card buildCard(getCard json) {
        return null;
    }

    public Action buildAction() {
        return null;
    }
}
