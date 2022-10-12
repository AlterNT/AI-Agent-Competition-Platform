package com.example.jsonobjects;

public class getAction {
    public String action;
    public int[] params;

    public getAction(String action, int[] params) {
        this.action = action;
        this.params = params;
    }

    public String getaction() {
        return this.action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public int[] getparams() {
        return this.params;
    }

    public void setParams(int[] params) {
        this.params = params;
    }
}
