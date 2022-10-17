package javaclient;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Random;

import javaclient.agents.gameAgent;
import javaclient.loveletter.Action;
import javaclient.loveletter.Agent;
import javaclient.loveletter.Card;
import javaclient.loveletter.IllegalActionException;
import javaclient.loveletter.State;
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
    static State playerState;
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
            throws InterruptedException, IOException, Error, IllegalActionException, URISyntaxException {

        /**
         * Using Command line arguments is currently unstable
         * though four hard coded agents can play together by changing
         * the value of agent token.
         */
        String agent_token = args[0];
        String game = args[1];
        String url = args[2];

        // Create instances of required classes to control game logic and access
        // endpoints
        gameAPI = new API(agent_token, url);
        stateUpdater = new stateUpdater();
        builder = new objectBuilder();

        // agent to be used in game
        agent1 = new gameAgent();
        // the state controller requires a minimum of 2 players to create game so
        // placeholder agent is used but never acessed
        placeholderAgent = new gameAgent();
        // assign agents into array that can be passed in the state constructor
        agents = new Agent[2];
        agents[0] = agent1;
        agents[1] = placeholderAgent;
        Random random = new Random();
        // creates state controller
        stateController = new State(random, agents);
        // creates player state
        playerState = stateController.playerState(0);

        while (true) {
            // attempt to join lobby through api
            boolean joined_lobby;
            try {
                joined_lobby = gameAPI.join_lobby(game);
            } catch (Error e) {
                e.printStackTrace();
                return;
            }

            // cli output
            if (joined_lobby == true) {
                System.out.print("Joined Lobby\n");
                while (gameAPI.game_started() == false) {
                    System.out.println("waiting for game to start...");
                    Thread.sleep(100);
                }

                System.out.println("game has started!");

                // while game is still playing continously check to see if its your turn
                while (!gameAPI.game_finished()) {
                    boolean is_turn = gameAPI.is_turn();
                    if (is_turn == true) {
                        System.out.println("agent is making a move.");
                        // get state and action json from api
                        JsonNode state = gameAPI.get_state();
                        JsonNode action = gameAPI.get_action();
                        try {
                            // update the player state
                            stateUpdater.updatePlayerState(stateController, state, action, agents[0], playerState);
                        } catch (IllegalActionException e) {
                        }

                        try {
                            // update state controller to reflect the current server state controller
                            stateController = stateUpdater.updateControllerState(stateController, state, action,
                                    stateController);
                        } catch (IllegalActionException e) {
                        }
                        // Get top card from state controler
                        Card topCard = stateController.drawCard();
                        // get the agent to make a move
                        Action move = agents[0].playCard(topCard);
                        try {
                            // send action via api
                            gameAPI.send_action(move);
                        } catch (IOException e) {
                            e.printStackTrace();
                            return;
                        }
                    }
                }
            }
        }
    }
}