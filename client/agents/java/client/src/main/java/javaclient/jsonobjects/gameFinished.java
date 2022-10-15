package javaclient.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class gameFinished {

    public final String agentToken;
    public final Boolean gameFinished;

    public gameFinished(@JsonProperty("agentToekn") String agentToken,
            @JsonProperty("gameFinished") Boolean gameFinished) {
        this.agentToken = agentToken;
        this.gameFinished = gameFinished;
    }

    public Boolean finished() {
        return this.gameFinished;
    }
}
