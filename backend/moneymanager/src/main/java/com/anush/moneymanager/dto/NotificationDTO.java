package com.anush.moneymanager.dto;

import java.util.Date;

public class NotificationDTO {
    private String title;
    private String message;
    private String type; // success, error, warning, info
    private Date timestamp;
    private boolean read;

    public NotificationDTO() {
        this.timestamp = new Date();
        this.read = false;
    }

    public NotificationDTO(String title, String message, String type) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.timestamp = new Date();
        this.read = false;
    }

    // Getters and setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}
