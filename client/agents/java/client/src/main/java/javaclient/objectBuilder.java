package javaclient;

import java.util.Iterator;

import javaclient.loveletter.Action;
import javaclient.loveletter.Card;
import javaclient.loveletter.IllegalActionException;
import javaclient.loveletter.State;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * This is a class created with the intention of taking a json api responses and
 * building
 * useable objects of the State and Action class that can be used for game logic
 * control
 * to adhere to the original code provided by the client.
 */
public class objectBuilder {

    /**
     * Constructor method
     */
    public objectBuilder() {

    }

    /**
     * This function takes in the api response for the updated state in json and
     * uses the provided state controller to update itself.
     * 
     * @param json          the updated state object in json as a JsonNode
     * @param controller    the state controller
     * @param stateToUpdate the controllers previous state object
     * @return a new state object that is up to date with the server state
     *         controller
     * @throws IllegalActionException
     */
    public State buildControllerState(JsonNode json, State controller, State playerState)
            throws IllegalActionException {
        // get the state node in the json response
        JsonNode state = json.get("state");
        // Create each required variable to update the state class in full
        int num = state.get("num").intValue();
        int[] discardCount = buildDiscardCount(state.get("discardCount"));
        Card[][] discards = buildDiscards(state.get("discards"));
        Card[] hand = buildHand(state.get("hand"));
        Card[] deck = buildDeck(state.get("deck"));
        int[] top = getTop(state.get("top"));
        boolean[][] known = buildKnown(state.get("known"));
        boolean[] handmaid = buildHandmaid(state.get("handmaid"));
        int[] scores = getScores(state.get("scores"));
        int[] nextPlayer = getNextPlayer(state.get("nextPlayer"));
        // use game controller to update new controller state
        playerState.updateNum(controller, num);
        playerState.updateDiscards(controller, discards);
        playerState.updateDiscardcount(controller, discardCount);
        playerState.updateHand(controller, hand);
        playerState.updateDeck(controller, deck);
        playerState.updateTop(controller, top);
        playerState.updateKnown(controller, known);
        playerState.updateHandmaid(controller, handmaid);
        playerState.updateScores(controller, scores);
        playerState.updateNext(controller, nextPlayer);

        return playerState;
    }

    /**
     * This function takes in the api response for the updated state in json and
     * uses the provided state controller to update and access the provided player
     * state.
     * 
     * @param json        the state object response in json from the api
     * @param controller  the state controller used for game logic
     * @param playerState the players previous state object to be updated
     * @returna new state object that is up to date with the server state
     *          controller
     * @throws IllegalActionException
     */
    public State buildState(JsonNode json, State controller, State playerState) throws IllegalActionException {
        // get the state node in the json response
        JsonNode state = json.get("state");
        // Create each required variable to update the state class in full
        int player = state.get("player").intValue();
        int num = state.get("num").intValue();
        int[] discardCount = buildDiscardCount(state.get("discardCount"));
        Card[][] discards = buildDiscards(state.get("discards"));
        Card[] hand = buildHand(state.get("hand"));
        Card[] deck = buildDeck(state.get("deck"));
        int[] top = getTop(state.get("top"));
        boolean[][] known = buildKnown(state.get("known"));
        boolean[] handmaid = buildHandmaid(state.get("handmaid"));
        int[] scores = getScores(state.get("scores"));
        int[] nextPlayer = getNextPlayer(state.get("nextPlayer"));
        // use game controller to update the players state object
        playerState.updatePlayer(controller, player);
        playerState.updateNum(controller, num);
        playerState.updateDiscards(controller, discards);
        playerState.updateDiscardcount(controller, discardCount);
        playerState.updateHand(controller, hand);
        playerState.updateDeck(controller, deck);
        playerState.updateTop(controller, top);
        playerState.updateKnown(controller, known);
        playerState.updateHandmaid(controller, handmaid);
        playerState.updateScores(controller, scores);
        playerState.updateNext(controller, nextPlayer);

        return playerState;
    }

    /**
     * This function takes a JsonNode object and uses two iterators
     * traverse all values in that node and build the state variable
     * discards.
     * 
     * one iterator is used to access each direct desendant
     * of the node and the second iterator is used on each
     * direct desendant to access every one of their children.
     * 
     * the first iterator represents the player
     * the second represents the card value
     * 
     * @param discards the state variable of discards in json
     * @return state variable instance discards
     */
    public Card[][] buildDiscards(JsonNode discards) {
        Iterator<JsonNode> it = discards.iterator();
        int playerCount = 0;
        int cardCount = 0;
        Card[][] results = new Card[discards.size()][16];
        while (it.hasNext()) {
            JsonNode temp = it.next();
            Iterator<JsonNode> it2 = temp.iterator();
            while (it2.hasNext()) {
                JsonNode temp2 = it2.next();
                // check to see if node is null and assign it if required
                if (temp2.isNull()) {
                    results[playerCount][cardCount] = null;
                } else {
                    results[playerCount][cardCount] = buildCard(temp2);
                }
                cardCount++;
                // avoid index out of bounds and reset counte
                if (cardCount == 16) {
                    cardCount = 0;
                }
            }
            playerCount++;
        }
        return results;
    }

    /**
     * Creates state variable discardCount from a JsonNode and converts into form
     * int[]
     * 
     * @param discardCount state variable discardCount in json
     * @return state variable instance of discardCount
     */
    public int[] buildDiscardCount(JsonNode discardCount) {
        Iterator<JsonNode> it = discardCount.iterator();
        int count = 0;
        int[] result = new int[4];
        while (it.hasNext()) {
            int temp = it.next().intValue();
            result[count] = temp;
        }
        return result;
    }

    public Card[] buildHand(JsonNode hand) {
        Iterator<JsonNode> it = hand.iterator();
        Card[] results = new Card[4];
        int count = 0;
        while (it.hasNext()) {
            JsonNode temp = it.next();
            Card tempCard = buildCard(temp);
            results[count] = tempCard;
            count++;
        }
        return results;
    }

    public Card[] buildDeck(JsonNode deck) {
        Iterator<JsonNode> it = deck.iterator();
        Card[] results = new Card[16];
        int count = 0;
        while (it.hasNext()) {
            JsonNode temp = it.next();
            Card tempCard = buildCard(temp);
            results[count] = tempCard;
            count++;
        }
        return results;
    }

    public int[] getTop(JsonNode top) {
        Iterator<JsonNode> it = top.iterator();
        int[] results = new int[1];
        JsonNode temp = it.next();
        results[0] = temp.intValue();
        return results;
    }

    public boolean[][] buildKnown(JsonNode known) {
        Iterator<JsonNode> it = known.iterator();
        int playerCount = 0;
        int seenCount = 0;
        boolean[][] results = new boolean[known.size()][4];
        while (it.hasNext()) {
            JsonNode temp = it.next();
            Iterator<JsonNode> it2 = temp.iterator();
            while (it2.hasNext()) {
                JsonNode temp2 = it2.next();
                if (temp2.booleanValue() == true) {
                    results[playerCount][seenCount] = temp2.booleanValue();
                } else {
                    results[playerCount][seenCount] = temp2.booleanValue();
                }
                seenCount++;
                if (seenCount == 4) {
                    seenCount = 0;
                }
            }
            playerCount++;
        }
        return results;
    }

    public boolean[] buildHandmaid(JsonNode handmaid) {
        Iterator<JsonNode> it = handmaid.iterator();
        int count = 0;
        boolean[] results = new boolean[handmaid.size()];
        while (it.hasNext()) {
            JsonNode temp = it.next();
            results[count] = temp.booleanValue();
            count++;
        }
        return results;
    }

    public int[] getScores(JsonNode scores) {
        Iterator<JsonNode> it = scores.iterator();
        int count = 0;
        int[] results = new int[scores.size()];
        while (it.hasNext()) {
            JsonNode temp = it.next();
            results[count] = temp.intValue();
            count++;
        }
        return results;
    }

    public int[] getNextPlayer(JsonNode nextPlayer) {
        Iterator<JsonNode> it = nextPlayer.iterator();
        int[] results = new int[1];
        JsonNode temp = it.next();
        results[0] = temp.intValue();
        return results;
    }

    /**
     * 
     * @param json
     * @return
     */
    public Card buildGuessCard(JsonNode json) {
        String name = json.toString();
        name = name.substring(1, name.length() - 1);
        switch (name) {
            case "Guard":
                return Card.GUARD;
            case "Priest":
                return Card.PRIEST;
            case "Baron":
                return Card.BARON;
            case "Handmaid":
                return Card.HANDMAID;
            case "Prince":
                return Card.PRINCE;
            case "King":
                return Card.KING;
            case "Countess":
                return Card.COUNTESS;
            case "Princess":
                return Card.PRINCESS;
            default:
                throw new Error();
        }

    }

    /**
     * 
     * @param json
     * @return
     */
    public Card buildCard(JsonNode json) {
        if (json.isNull()) {
            return null;
        }

        String name = json.get("name").toString();
        name = name.substring(1, name.length() - 1);

        switch (name) {
            case "Guard":
                return Card.GUARD;
            case "Priest":
                return Card.PRIEST;
            case "Baron":
                return Card.BARON;
            case "Handmaid":
                return Card.HANDMAID;
            case "Prince":
                return Card.PRINCE;
            case "King":
                return Card.KING;
            case "Countess":
                return Card.COUNTESS;
            case "Princess":
                return Card.PRINCESS;
            default:
                throw new Error();
        }
    }

    /**
     * 
     * @param json
     * @return
     * @throws IllegalActionException
     */
    public Action buildAction(JsonNode json) throws IllegalActionException {
        JsonNode action = json.get("action");
        if (action.isNull()) {
            return null;
        }
        Card card = buildCard(action.get("card"));
        int player = action.get("player").intValue();
        int target = action.get("target").intValue();
        try {
            switch (card) {
                case GUARD:
                    Card guess = buildGuessCard(action.get("guess"));
                    return Action.playGuard(player, target, guess);
                case PRIEST:
                    return Action.playPriest(player, target);
                case BARON:
                    return Action.playBaron(player, target);
                case HANDMAID:
                    return Action.playHandmaid(player);
                case PRINCE:
                    return Action.playPrince(player, target);
                case KING:
                    return Action.playKing(player, target);
                case COUNTESS:
                    return Action.playCountess(player);
                default:
                    return null;
            }
        } catch (IllegalActionException e) {
            throw e;
        }
    }

    public String[] buildParams(Action action) {
        int count = 0;
        Card guess = null;
        String target = "";
        String player = String.valueOf(action.player());
        count++;
        if (!(action.guess() == null)) {
            guess = action.guess();
            count++;
        }
        if (action.card() != Card.HANDMAID || action.card() != Card.COUNTESS) {
            target = String.valueOf(action.target());
            count++;
        }

        String[] results = new String[count];
        results[0] = player;

        if (action.card() != Card.HANDMAID || action.card() != Card.COUNTESS) {
            results[1] = target;
        }

        if (action.card() == Card.GUARD) {
            results[2] = guess.toString();
        }

        return results;
    }
}