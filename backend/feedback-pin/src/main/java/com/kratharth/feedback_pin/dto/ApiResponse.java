package com.kratharth.feedback_pin.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private List<T> data;
    private int status;
    private String message;

    // Constructors
    public ApiResponse() {}

    public ApiResponse(List<T> data, int status, String message) {
        this.data = data;
        this.status = status;
        this.message = message;
    }

    public ApiResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    // Getters and Setters
    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Static factory methods for common responses
    public static <T> ApiResponse<T> success(List<T> data, String message) {
        return new ApiResponse<>(data, 200, message);
    }

    public static <T> ApiResponse<T> success(List<T> data) {
        return new ApiResponse<>(data, 200, "Success");
    }

    public static <T> ApiResponse<T> error(int status, String message) {
        return new ApiResponse<>(status, message);
    }

    public static ApiResponse<Object> successMessage(String message) {
        return new ApiResponse<>(200, message);
    }

    public static ApiResponse<Object> errorMessage(int status, String message) {
        return new ApiResponse<>(status, message);
    }
}
