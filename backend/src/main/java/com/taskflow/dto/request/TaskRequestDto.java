package com.taskflow.dto.request;

import com.taskflow.entity.Task.Status;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
public class TaskRequestDto {
    @NotBlank(message = "Title cannot be blank")
    private String title;

    private String description;

    @NotNull(message = "Due date cannot be null")
    private LocalDateTime dueDate;

    @NotBlank(message = "Priority cannot be blank")
    private String priority;

    private Status status = Status.TODO;
}