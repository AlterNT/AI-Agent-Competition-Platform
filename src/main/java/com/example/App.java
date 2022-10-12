package com.example;

import java.io.IOException;
import java.util.Random;

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

    static Agent agent1;
    static Agent placeholderAgent;
    static Agent[] agents;
    static State[] playerStates;
    static API gameAPI;
    static String token;
    static String game;
    static stateUpdater stateUpdater;
    static State stateControiler;
    static objectBuilder builder;

    /**
     * 
     * @param args
     * @throws InterruptedException
     * @throws IOException
     * @throws Error
     * @throws IllegalActionException
     */
    public static void main(String[] args) throws InterruptedException, IOException, Error, IllegalActionException {

        gameAPI = new API("1");
        String agent_token = "10";
        String game = "love-letter";
        gameAPI = new API(agent_token);
        stateUpdater = new stateUpdater();
        builder = new objectBuilder();

        agent1 = new RandomAgent();
        placeholderAgent = new RandomAgent();
        agents = new Agent[2];
        agents[0] = agent1;
        agents[1] = placeholderAgent;
        Random random = new Random();
        stateControiler = new State(random, agents);
        playerStates = new State[2];
        for (int i = 0; i < 2; i++) {
            playerStates[i] = stateControiler.playerState(i);
            agents[i].newRound(playerStates[i]);
        }

        // JsonNode action = gameAPI.get_action();
        // System.out.println(action.get("action").get("card").get("name").toString());
        // Action theAction = builder.buildAction(action);
        JsonNode state = gameAPI.get_state();
        State gameState = builder.buildState(state, stateControiler, playerStates[0]);
        // System.out.println(theAction.card().value());

        // if (game == "love-letter") {
        // agent1 = new RandomAgent();
        // placeholderAgent = new RandomAgent();
        // agents = new Agent[2];
        // agents[0] = agent1;
        // agents[1] = placeholderAgent;
        // Random random = new Random();
        // stateControiler = new State(random, agents);
        // playerStates = new State[2];
        // for (int i = 0; i < 2; i++) {
        // playerStates[i] = stateControiler.playerState(i);
        // agents[i].newRound(playerStates[i]);
        // }
        // } else {
        // ;
        // }

        // while (true) {
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

        // System.out.println("game has started!");

        // while (!gameAPI.game_finished()) {
        // boolean is_turn = gameAPI.is_turn();
        // if (is_turn == true) {
        // System.out.println("agent is making a move.");
        // // get/build agent state
        // JsonNode state = gameAPI.get_state();
        // JsonNode action = gameAPI.get_action();
        // try {
        // stateUpdater.updatePlayerState(stateControiler, state, action, agents[0],
        // playerStates[0]);
        // } catch (IllegalActionException e) {
        // e.printStackTrace();
        // return;
        // }
        // // get top/build card from server side state controller
        // JsonNode topCard = gameAPI.request_method("getTopCard");
        // Card agentCard = builder.buildCard(topCard);
        // // get the agent to make a move & send the action via api
        // Action move = agents[1].playCard(agentCard);
        // try {
        // gameAPI.send_action(move);
        // } catch (IOException e) {
        // e.printStackTrace();
        // return;
        // }
        // }
        // Thread.sleep(1000);
        // }
        // }
        Thread.sleep(1000);
        // }
    }
}