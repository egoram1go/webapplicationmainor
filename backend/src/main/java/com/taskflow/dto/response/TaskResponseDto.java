package com.taskflow.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.taskflow.entity.Task;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private String priority;
    private Task.Status status;
    private Long userId;
    private String username;
    private boolean inCart;
    private boolean offered;
    private List<CommentResponseDto> comments;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}