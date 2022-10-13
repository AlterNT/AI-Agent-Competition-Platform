package com.example;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Random;

import org.json.JSONException;
import org.json.JSONObject;

import com.example.agents.RandomAgent;
import com.example.loveletter.Action;
import com.example.loveletter.Agent;
import com.example.loveletter.Card;
import com.example.loveletter.IllegalActionException;
import com.example.loveletter.State;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * Hello world!
 *
 */
public class App {

    public static Agent agent1;
    public static Agent placeholderAgent;
    public static Agent placeholderAgent2;
    public static Agent placeholderAgent3;
    static Agent[] agents;
    static State[] playerStates;
    static API gameAPI;
    static String token;
    static String game;
    static stateUpdater stateUpdater;
    static State stateController;
    static objectBuilder builder;

    /**
     * 
     * @param args
     * @throws InterruptedException
     * @throws IOException
     * @throws Error
     * @throws IllegalActionException
     * @throws URISyntaxException
     * @throws JSONException
     */
    public static void main(String[] args)
            throws InterruptedException, IOException, Error, IllegalActionException, URISyntaxException, JSONException {
        String agent_token = "10";
        String game = "love-letter";
        gameAPI = new API(agent_token);
        stateUpdater = new stateUpdater();
        builder = new objectBuilder();

        if (game == "love-letter") {
            agent1 = new RandomAgent();
            placeholderAgent = new RandomAgent();
            placeholderAgent2 = new RandomAgent();
            placeholderAgent3 = new RandomAgent();
            agents = new Agent[4];
            agents[0] = agent1;
            agents[1] = placeholderAgent;
            agents[2] = placeholderAgent2;
            agents[3] = placeholderAgent3;
            Random random = new Random();
            stateController = new State(random, agents);
            playerStates = new State[4];
            for (int i = 0; i < agents.length; i++) {
                playerStates[i] = stateController.playerState(i);
                agents[i].newRound(playerStates[i]);
            }
        } else {
            ;
        }

        while (true) {
            // boolean joined_lobby;
            // try {
            // joined_lobby = gameAPI.join_lobby(game);
            // } catch (Error e) {
            // e.printStackTrace();
            // return;
            // }

            // if (joined_lobby == true) {
            // System.out.print("Joined Lobby\n");
            // while (gameAPI.game_started() == false) {
            // System.out.println("waiting for game to start...");
            // Thread.sleep(1000);
            // }

            System.out.println("game has started!");

            while (!gameAPI.game_finished()) {
                boolean is_turn = gameAPI.is_turn();
                if (is_turn == true) {
                    System.out.println("agent is making a move.");
                    // get/build agent & controller state
                    JsonNode state = gameAPI.get_state();
                    JsonNode action = gameAPI.get_action();
                    try {
                        stateUpdater.updatePlayerState(stateController, state, action, agents[0], playerStates[0]);
                    } catch (IllegalActionException e) {
                    }

                    try {
                        stateController = stateUpdater.updateControllerState(stateController, state, action,
                                stateController);
                    } catch (IllegalActionException e) {
                    }
                    // Get top card
                    Card topCard = stateController.drawCard();
                    // get the agent to make a move & send the action via api
                    Action move = agents[0].playCard(topCard);
                    try {
                        gameAPI.send_action(move);
                    } catch (IOException e) {
                        e.printStackTrace();
                        return;
                    }
                }
                Thread.sleep(1000);
            }
        }
    }
}
// }