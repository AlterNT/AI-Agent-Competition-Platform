package Client.Agents;

import java.util.Random;
import java.util.Scanner;

public class Agent {
    public static final String ROCK = "ROCK";
    public static final String PAPER = "PAPER";
    public static final String SCISSORS = "SCISSORS";

    public Agent() {}

    public String move() {
        String move;

        Random random = new Random();
        int choice = random.nextInt(3) + 1;

        if (choice == 1)
            move = ROCK;
        else if (choice == 2)
            move = PAPER;
        else
            move = SCISSORS;
            
        return move;    
    }

    public static void main(String[] args) {
        Agent agent = new Agent();
        while (true) {
            Scanner reader = new Scanner(System.in);
            String command = reader.nextLine();
            reader.close();

            if (command.equals("move")) {
                String move = agent.move();
                System.out.println(move);
            }
        }
    }
}
