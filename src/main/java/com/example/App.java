package com.example;

import java.io.IOException;

import com.example.agents.RandomAgent;
import com.example.loveletter.Agent;

/**
 * Hello world!
 *
 */
public class App {

    static Agent agent1;
    static API gameAPI;
    static AIO io;
    static String token;
    static String game;

    public static void main(String[] args) throws InterruptedException, IOException, Error {

        gameAPI = new API("1");

        String agent_token = "1";
        String game = "love-letter";
        gameAPI = new API(agent_token);
        io = new AIO(gameAPI);

        if (game == "love-letter") {
            agent1 = new RandomAgent();
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
                System.out.print("Joined Lobby");
                String waiting = ".";
                while (!gameAPI.game_started()) {
                    String output = String.format("waiting for game to start %s", waiting);
                    waiting += waiting;
                    System.out.println(output);
                    Thread.sleep(100);
                }

                System.out.println("game has started!");

                while (!gameAPI.game_finished()) {
                    boolean is_turn = gameAPI.is_turn();
                    if (is_turn == true) {
                        System.out.println("agent is making a move.");
                        // agent1.state = gameAPI.get_state();
                        // move = agent1.move();
                    }
                    Thread.sleep(100);
                }
            }
            Thread.sleep(1000);
        }
    }
}