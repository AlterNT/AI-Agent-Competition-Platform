package com.example;

import java.io.IOException;
import java.util.Random;

import com.example.agents.RandomAgent;
import com.example.jsonobjects.getCard;
import com.example.jsonobjects.getState;
import com.example.loveletter.Action;
import com.example.loveletter.Agent;
import com.example.loveletter.Card;
import com.example.loveletter.IllegalActionException;
import com.example.loveletter.State;

/**
 * Hello world!
 *
 */
public class App {

    static Agent agent1;
    static Agent placeholderAgent;
    static Agent[] agents;
    static API gameAPI;
    static String token;
    static String game;
    static stateUpdater stateUpdater;
    static getState state;
    static State stateControiler;
    static objectBuilder builder;

    public static void main(String[] args) throws InterruptedException, IOException, Error, IllegalActionException {

        gameAPI = new API("1");
        String agent_token = "10";
        String game = "love-letter";
        gameAPI = new API(agent_token);
        stateUpdater = new stateUpdater();
        builder = new objectBuilder();

        if (game == "love-letter") {
            agent1 = new RandomAgent();
            placeholderAgent = new RandomAgent();
            agents = new Agent[2];
            agents[0] = agent1;
            agents[1] = placeholderAgent;
            Random random = new Random();
            stateControiler = new State(random, agents);
            State[] playerStates = new State[2];
            for (int i = 0; i < 2; i++) {
                playerStates[i] = stateControiler.playerState(i);
                agents[i].newRound(playerStates[i]);
            }
        } else {
            ;
        }

        while (true) {
            boolean joined_lobby;
            try {
                joined_lobby = gameAPI.join_lobby(game);
            } catch (Error e) {
                e.printStackTrace();
                return;
            }

            if (joined_lobby == true) {
                System.out.print("Joined Lobby\n");
                while (gameAPI.game_started() == false) {
                    System.out.println("waiting for game to start...");
                    Thread.sleep(1000);
                }

                System.out.println("game has started!");

                while (!gameAPI.game_finished()) {
                    boolean is_turn = gameAPI.is_turn();
                    if (is_turn == true) {
                        System.out.println("agent is making a move.");
                        // update agent state
                        getState state = gameAPI.get_state();
                        stateUpdater.updatePlayerState(stateControiler, state, agents[1]);
                        getCard topCard = gameAPI.request_method("getTopCard");
                        Card agentCard = builder.buildCard(topCard);
                        // get the agent to make a move
                        Action move = agents[1].playCard(agentCard);
                        // send the action via api
                        gameAPI.send_action(move);
                    }
                    Thread.sleep(1000);
                }
            }
            Thread.sleep(1000);
        }
    }
}