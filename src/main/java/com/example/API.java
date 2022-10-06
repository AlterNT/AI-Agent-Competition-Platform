package com.example;

import java.net.URL;

import com.example.jsonobjects.gameFinished;
import com.example.jsonobjects.gameStarted;
import com.example.jsonobjects.getState;
import com.example.jsonobjects.isTurn;
import com.example.jsonobjects.joinLobby;
import com.example.jsonobjects.sendAction;
import com.example.loveletter.Action;
import com.example.loveletter.Card;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;

public class API {

    private String token;

    public API(String agentToken) {
        this.token = agentToken;
    }

    public void join_lobby(String gameID) throws IOException {
        try {
            // Sets up connection parameters
            URL url = new URL("http://localhost:8080/api/join");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates Json Body for request
            ObjectMapper mapperRequest = new ObjectMapper();
            ObjectNode rootNode = mapperRequest.createObjectNode();
            rootNode.put("agentToken", this.token);
            rootNode.put("gameID", gameID);
            String lobbyJSON = mapperRequest.writerWithDefaultPrettyPrinter().writeValueAsString(rootNode);

            // Writes out the created json to the body
            OutputStream os = connection.getOutputStream();
            OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
            osw.write(lobbyJSON);
            osw.flush();
            osw.close();
            os.close();
            connection.connect();

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            joinLobby json = mapper.readValue(responseStream, joinLobby.class);

            if (json.success == false) {
                throw new Error();
            }

        } catch (IOException e) {
            throw new IOException("connetion refused\n Failed at join_lobby()");
        }
    }

    public Boolean game_started() throws IOException {
        try {
            // Sets up connection parameters
            String output = String.format("http://localhost:8080/api/started?agentToekn=%s", this.token);
            URL url = new URL(output);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            gameStarted json = mapper.readValue(responseStream, gameStarted.class);

            // Check json response and see if game has been started.
            if (json.gameStarted == false) {
                return false;
            } else {
                return true;
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lost Connection\n Failed at game_started()");
        }
    }

    public Boolean game_finished() throws IOException {
        try {
            // Sets up connection parameters
            String output = String.format("http://localhost:8080/api/finished?agentToekn=%s", this.token);
            URL url = new URL(output);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            gameFinished json = mapper.readValue(responseStream, gameFinished.class);

            // Check json response and see if game has been started.
            if (json.gameFinished == false) {
                return false;
            } else {
                return true;
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lost Connection\n Failed at game_finished()");
        }
    }

    public Boolean is_turn() throws IOException {
        try {
            // Sets up connection parameters
            String output = String.format("http://localhost:8080/api/turn?agentToekn=%s", this.token);
            URL url = new URL(output);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            isTurn json = mapper.readValue(responseStream, isTurn.class);

            // Check json response and see if game has been started.
            if (json.isTurn == false) {
                return false;
            } else {
                return true;
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lost Connection\n Failed at is_turn()");
        }
    }

    public Object get_state() throws IOException {
        try {
            // Sets up connection parameters
            String output = String.format("http://localhost:8080/api/state?agentToekn=%s", this.token);
            URL url = new URL(output);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            getState json = mapper.readValue(responseStream, getState.class);

            // Check json response and see if game has been started.
            if (json.state == null) {
                throw new Error("state received was null");
            } else {
                return json.state;
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lost Connection\n Failed at get_state()");
        }
    }

    public Boolean send_action(Action action, Card card) throws IOException {
        try {
            // Sets up connection parameters
            URL url = new URL("http://localhost:8080/api/action");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates Json Body for request
            ObjectMapper mapperRequest = new ObjectMapper();
            String actionName = String.format("play%s", card.toString());
            ObjectNode rootNode = mapperRequest.createObjectNode();
            rootNode.put("agentToken", this.token);
            rootNode.put("action", actionName);
            String lobbyJSON = mapperRequest.writerWithDefaultPrettyPrinter().writeValueAsString(rootNode);

            // Writes out the created json to the body
            OutputStream os = connection.getOutputStream();
            OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
            osw.write(lobbyJSON);
            osw.flush();
            osw.close();
            os.close();
            connection.connect();

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            sendAction json = mapper.readValue(responseStream, sendAction.class);

            if (json.success == false) {
                return false;
            } else {
                return true;
            }

        } catch (IOException e) {
            throw new IOException("connetion refused\n Failed at send_action()");
        }
    }

    public Object request_method(String[] keys, String method, String[] params) {
        // Sets up connection parameters
        URL url = new URL("http://localhost:8080/api/action");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setDoOutput(true);
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Accept", "application/json");
        connection.setRequestProperty("Content-Type", "application/json");

        return null;
    }
}
