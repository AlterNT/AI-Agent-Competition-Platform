package com.example.jsonobjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class getCard {
    public final int value;
    public final String name;
    public final int count;

    public getCard(@JsonProperty("value") int value, @JsonProperty("name") String name,
            @JsonProperty("count") int count) {
        this.value = value;
        this.name = name;
        this.count = count;
    }
}
