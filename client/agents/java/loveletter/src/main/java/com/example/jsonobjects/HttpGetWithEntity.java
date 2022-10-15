package com.example.jsonobjects;

import java.io.UnsupportedEncodingException;
import java.net.URI;

import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.entity.StringEntity;
import org.json.JSONObject;

public class HttpGetWithEntity extends HttpEntityEnclosingRequestBase {
    public final static String METHOD_NAME = "GET";
    JSONObject requestBody = null;

    public HttpGetWithEntity(URI uri, JSONObject requestBody) throws UnsupportedEncodingException {
        this.setURI(uri);
        StringEntity stringEntity = new StringEntity(requestBody.toString());
        super.setEntity(stringEntity);
        this.requestBody = requestBody;

    }

    @Override
    public String getMethod() {
        return METHOD_NAME;
    }
}