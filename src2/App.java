import agents.*;
import loveletter.*;
// import com.journaldev.threads;

public class App {
    static Agent agent1;
    static API gameAPI;
    static AIO io;

    public static void main(String[] args) {

        gameAPI = new API("1");
        gameAPI.request_method();

        String agent_token = args[1];
        String game = args[2];
        // this.gameAPI = new API(agent_token);
        // this.io = new AIO(gameAPI);

        // if (game == "love-letter") {
        // agent1 = new RandomAgent();
        // System.out.println("kkkkkkk");
        // } else {
        // break;
        // }

        // while (true) {
        // boolean joined_lobby = gameAPI.game_started();

        // if (joined_lobby == true) {
        // System.out.println("joined lobby");
        // String waiting = ".";
        // while (!gameAPI.game_started()) {
        // String output = String.format("waiting for game to start %s", waiting);
        // waiting += waiting;
        // System.out.println(output);
        // }

        // System.out.println("game has started!");

        // while (!gameAPI.game_finished()) {
        // boolean is_turn = gameAPI.is_turn();
        // if (is_turn == true) {
        // System.out.println("agent is making a move.");
        // agent1.state = gameAPI.get_state();
        // move = agent1.move();
        // }
        // Thread.sleep(100);
        // }
        // }
        // Thread.sleep(1000);
        // }
    }
}