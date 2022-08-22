package agent;

import java.util.Random;
import java.util.Scanner;
class ClientIO {
    
    void clientIn() {
        Scanner reader = new Scanner(System.in);
        String command = reader.nextLine();
        reader.close();
    }

    void clientOut(String data) {
        console.log(data);
    }
}