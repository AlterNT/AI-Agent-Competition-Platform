package javaclient;

import java.net.URL;

import javaclient.jsonobjects.gameFinished;
import javaclient.jsonobjects.gameStarted;
import javaclient.jsonobjects.isTurn;
import javaclient.jsonobjects.joinLobby;
import javaclient.jsonobjects.sendActionResponse;
import javaclient.loveletter.Action;
import javaclient.loveletter.Card;
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
    private objectBuilder builder;

    /**
     * 
     * @param agentToken
     */
    public API(String agentToken) {
        this.token = agentToken;
        this.builder = new objectBuilder();
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
            String[] params = builder.buildParams(action);

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

            if (action.card() == Card.COUNTESS || action.card() == Card.HANDMAID) {
                actionNode.putArray("params").add(Integer.valueOf(params[0]));
            } else if (action.card() != Card.GUARD) {
                actionNode.putArray("params").add(Integer.valueOf(params[0])).add(Integer.valueOf(params[1]));
            } else {
                actionNode.putArray("params").add(Integer.valueOf(params[0])).add(Integer.valueOf(params[1]))
                        .add(params[2]);
            }

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