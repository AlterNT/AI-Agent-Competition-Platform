package com.example;

import java.io.IOException;

import com.example.loveletter.Action;
import com.example.loveletter.Card;

public class AIO {

    private API api;

    public AIO(API api) {
        this.api = api;
    }

    public Boolean join_lobby(String gameID) throws Error {
        try {
            api.join_lobby(gameID);
            return true;
        } catch (IOException e) {
            throw new Error("Joining lobby failed");
        }
    }

    public Boolean legal_action(int player_index, Action action, Card drawn) {

        String player_int = Integer.toString(player_index);
        String[] keys = new String[3];
        keys[0] = "agents";
        keys[1] = player_int;
        keys[2] = "state";

        Card actionCard = action.card();
        String actionName = String.format("play%s", actionCard.toString());
        String drawnCard = drawn.toString();
        String[] params = new String[2];
        params[0] = actionName;
        params[1] = drawnCard;

        Object response = api.request_method(keys, "legalACtion", params);
        return true;
    }

    public Boolean get_card(int player_index) {

        String player_int = Integer.toString(player_index);
        String[] keys = new String[3];
        keys[0] = "agents";
        keys[1] = player_int;
        keys[2] = "state";

        String[] params = new String[1];
        params[0] = player_int;

        Object response = api.request_method(keys, "getCard", params);

        return true;
    }

    public Boolean get_player_index(String agentToken) {

        String[] keys = new String[3];
        keys[0] = "agents";
        keys[1] = agentToken;
        keys[2] = "state";

        Object response = api.request_method(keys, "getPlayerIndex", null);

        return true;
    }

    public Boolean get_top_card() {
        Object response = api.request_method(null, "getTopCard", null);
        return true;
    }
}
