package com.example;

import java.net.URL;

import com.example.jsonobjects.gameFinished;
import com.example.jsonobjects.gameStarted;
import com.example.jsonobjects.isTurn;
import com.example.jsonobjects.joinLobby;
import com.example.jsonobjects.sendActionResponse;
import com.example.jsonobjects.getAction;
import com.example.loveletter.Action;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;

/**
 * 
 */
public class API {

    private String token;

    /**
     * 
     * @param agentToken
     */
    public API(String agentToken) {
        this.token = agentToken;
    }

    // POST
    /**
     * 
     * @param gameID
     * @return
     * @throws IOException
     */
    public Boolean join_lobby(String gameID) throws IOException {
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

            if (!json.success()) {
                return false;
            } else {
                return true;
            }

        } catch (IOException e) {
            throw new IOException("connetion refused at join_lobby()");
        }
    }

    // GET
    /**
     * 
     * @return
     * @throws IOException
     */
    public Boolean game_started() throws IOException {
        try {
            // Sets up connection parameters
            String output = "http://localhost:8080/api/started?agentToken=" + this.token;
            URL url = new URL(output);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            gameStarted json = mapper.readValue(responseStream, gameStarted.class);

            // Check json response and see if game has been started.
            if (json.started()) {
                return true;
            } else {
                return false;
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lost Connection at game_started()");
        }
    }

    // GET
    /**
     * 
     * @return
     * @throws IOException
     */
    public Boolean game_finished() throws IOException {
        try {
            // Sets up connection parameters
            String output = "http://localhost:8080/api/finished?agentToken=" + this.token;
            URL url = new URL(output);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            gameFinished json = mapper.readValue(responseStream, gameFinished.class);

            // Check json response and see if game has been started.
            if (json.finished()) {
                return true;
            } else {
                return false;
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lost Connection");
        }
    }

    // GET
    /**
     * 
     * @return
     * @throws IOException
     */
    public Boolean is_turn() throws IOException {
        try {
            // Sets up connection parameters
            String output = "http://localhost:8080/api/turn?agentToken=" + this.token;
            URL url = new URL(output);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            isTurn json = mapper.readValue(responseStream, isTurn.class);

            // Check json response and see if game has been started.
            if (json.turn()) {
                return true;
            } else {
                return false;
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lost Connection");
        }
    }

    // GET
    /**
     * 
     * @return
     * @throws IOException
     */
    public JsonNode get_state() throws IOException {
        try {
            // Sets up connection parameters
            String output = "http://localhost:8080/api/state?agentToken=" + this.token;
            URL url = new URL(output);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(responseStream);
            return json;

        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lost Connection");
        }
    }

    // GET
    /**
     * 
     * @return
     * @throws IOException
     */
    public JsonNode get_action() throws IOException {
        try {
            // Sets up connection parameters
            String output = "http://localhost:8080/api/getAction?agentToken=" + this.token;
            URL url = new URL(output);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates input stream and converts to json object
            InputStream responseStream = connection.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(responseStream);
            return json;

        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lost Connection");
        }
    }

    // POST
    /**
     * 
     * @param action
     * @return
     * @throws IOException
     */
    public Boolean send_action(Action action) throws IOException {
        try {

            // Create Json string for agent variable in json response
            String actionName = String.format("play%s", action.card().toString());
            int[] params = new int[2];
            params[0] = action.player();
            params[1] = action.target();

            // Sets up connection parameters
            URL url = new URL("http://localhost:8080/api/action");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json");

            // Creates Json Body for request
            ObjectMapper mapperRequest = new ObjectMapper();
            ObjectNode rootNode = mapperRequest.createObjectNode();
            rootNode.put("agentToken", this.token);
            ObjectNode actionNode = mapperRequest.createObjectNode();
            actionNode.put("action", actionName);
            actionNode.putArray("params").add(params[0]).add(params[1]);
            rootNode.with("action").setAll(actionNode);
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
            sendActionResponse json = mapper.readValue(responseStream, sendActionResponse.class);

            if (json.success == false) {
                return false;
            } else {
                return true;
            }

        } catch (IOException e) {
            throw new IOException("connetion refused");
        }
    }
}
