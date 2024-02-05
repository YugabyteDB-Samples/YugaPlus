package com.yugaplus.backend.api;

public class Status {
    /* Success or failure */
    private boolean success;
    /* HTTP status code */
    private int code;
    /* Optional message */
    private String message;

    public Status() {
    }

    public Status(boolean success, int statusCode) {
        this.success = success;
        this.code = statusCode;
    }

    public Status(boolean success, int statusCode, String message) {
        this.success = success;
        this.code = statusCode;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int statusCode) {
        this.code = statusCode;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
