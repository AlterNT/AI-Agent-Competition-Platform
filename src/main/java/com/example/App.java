package com.example;

import java.io.IOException;
import java.util.Random;

import com.example.agents.RandomAgent;
import com.example.jsonobjects.getState;
import com.example.loveletter.Agent;
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
    static AIO io;
    static String token;
    static String game;
    static objectBuilder builder;
    static getState state;
    static State stateControiler;

    public static void main(String[] args) throws InterruptedException, IOException, Error, IllegalActionException {

        gameAPI = new API("1");
        String agent_token = "10";
        String game = "love-letter";
        gameAPI = new API(agent_token);
        io = new AIO(gameAPI);
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
            }
        } else {
            ;
        }

        while (true) {
            boolean joined_lobby;
            try {
                joined_lobby = io.join_lobby(game);
            } catch (Error e) {
                e.printStackTrace();
                return;
            }

            if (joined_lobby == true) {
                System.out.print("Joined Lobby\n");
                String waiting = "........";
                String output = String.format("waiting for game to start %s", waiting);
                while (gameAPI.game_started() == false) {
                    System.out.println(gameAPI.game_started());
                    Thread.sleep(1000);
                }

                System.out.println("game has started!");

                while (!gameAPI.game_finished()) {
                    boolean is_turn = gameAPI.is_turn();
                    if (is_turn == true) {
                        System.out.println("agent is making a move.");
                        getState state = gameAPI.get_state();

                    }
                    Thread.sleep(100);
                }
            }
            Thread.sleep(1000);
        }
    }
}