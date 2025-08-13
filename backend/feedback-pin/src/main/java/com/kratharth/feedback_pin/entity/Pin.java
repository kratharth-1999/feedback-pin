package com.kratharth.feedback_pin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "Pin")
public class Pin {

    @Id
    private String id;

    @NotNull
    @Column(name = "x", nullable = false)
    private Integer x;

    @NotNull
    @Column(name = "y", nullable = false)
    private Integer y;

    @NotBlank
    @Column(name = "path", nullable = false)
    private String path;

    @NotBlank
    @Column(name = "feedback", nullable = false, columnDefinition = "TEXT")
    private String feedback;

    @NotNull
    @Column(name = "createdAt", nullable = false)
    private Long createdAt;

    @NotBlank
    @Column(name = "emailId", nullable = false)
    private String emailId;

    // Default constructor
    public Pin() {}

    // Constructor
    public Pin(String id, Integer x, Integer y, String path, String feedback, Long createdAt, String emailId) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.path = path;
        this.feedback = feedback;
        this.createdAt = createdAt;
        this.emailId = emailId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    @Override
    public String toString() {
        return "Pin{" +
                "id='" + id + '\'' +
                ", x=" + x +
                ", y=" + y +
                ", path='" + path + '\'' +
                ", feedback='" + feedback + '\'' +
                ", createdAt=" + createdAt +
                ", emailId='" + emailId + '\'' +
                '}';
    }
}