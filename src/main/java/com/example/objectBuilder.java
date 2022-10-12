package com.example;

import com.example.loveletter.Action;
import com.example.loveletter.Card;
import com.example.loveletter.IllegalActionException;
import com.example.loveletter.State;
import com.fasterxml.jackson.databind.JsonNode;

public class objectBuilder {

    public objectBuilder() {

    }

    public State buildState(JsonNode json, State controller) {
        JsonNode state = json.get("state");
        String[][] discards = new String[4][16];
        return null;
    }

    public Card buildGuessCard(JsonNode json) {
        String name = json.toString();
        switch (name) {
            case "Guard":
                return Card.GUARD;
            case "Priest":
                return Card.PRIEST;
            case "Baron":
                return Card.BARON;
            case "Handmaid":
                return Card.HANDMAID;
            case "Prince":
                return Card.PRINCE;
            case "King":
                return Card.KING;
            case "Countess":
                return Card.COUNTESS;
            case "Princess":
                return Card.PRINCESS;
            default:
                throw new Error();
        }

    }

    public Card buildCard(JsonNode json) {
        String name = json.get("name").toString();
        switch (name) {
            case "Guard":
                return Card.GUARD;
            case "Priest":
                return Card.PRIEST;
            case "Baron":
                return Card.BARON;
            case "Handmaid":
                return Card.HANDMAID;
            case "Prince":
                return Card.PRINCE;
            case "King":
                return Card.KING;
            case "Countess":
                return Card.COUNTESS;
            case "Princess":
                return Card.PRINCESS;
            default:
                throw new Error();
        }
    }

    public Action buildAction(JsonNode json) throws IllegalActionException {
        JsonNode action = json.get("action");
        Card card = buildCard(action.get("card"));
        int player = action.get("player").intValue();
        int target = action.get("target").intValue();
        switch (card) {
            case GUARD:
                Card guess = buildGuessCard(action.get("guess"));
                return Action.playGuard(player, target, guess);
            case PRIEST:
                return Action.playPriest(player, target);
            case BARON:
                return Action.playBaron(player, target);
            case HANDMAID:
                return Action.playHandmaid(player);
            case PRINCE:
                return Action.playPrince(player, target);
            case KING:
                return Action.playKing(player, target);
            case COUNTESS:
                return Action.playCountess(player);
            default:
                return null;
        }
    }
}
