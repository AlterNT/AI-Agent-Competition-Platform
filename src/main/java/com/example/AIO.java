package com.example;

import java.io.IOException;

import com.example.loveletter.Action;
import com.example.loveletter.Card;

/* DEPRECATTED */

public class AIO {

    private API api;

    public AIO(API api) {
        this.api = api;
    }

    public Boolean get_top_card() {
        Object response = api.request_method(null, "getTopCard", null);
        return true;
    }
}
