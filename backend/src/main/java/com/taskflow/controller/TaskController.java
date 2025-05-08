package com.taskflow.controller;

import com.taskflow.dto.request.TaskRequestDto;
import com.taskflow.dto.response.TaskResponseDto;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService service;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public TaskController(TaskService service, ModelMapper modelMapper, UserRepository userRepository) {
        this.service = service;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAllTasks() {
        List<TaskResponseDto> tasks = service.getAllTasks().stream()
                .map(task -> modelMapper.map(task, TaskResponseDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/cart")
    public List<TaskResponseDto> getCartTasks(@AuthenticationPrincipal UserPrincipal principal) {
        return service.getCartTasks(principal.getId()).stream()
                .map(task -> modelMapper.map(task, TaskResponseDto.class))
                .collect(Collectors.toList());
    }

    @GetMapping("/user")
    public List<TaskResponseDto> getTasks(@AuthenticationPrincipal UserPrincipal principal) {
        return service.getTasksForUser(principal.getId()).stream()
                .map(task -> modelMapper.map(task, TaskResponseDto.class))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/cart/add")
    public ResponseEntity<TaskResponseDto> addToCart(@PathVariable Long id) {
        Optional<Task> updatedTask = service.addToCart(id);
        return updatedTask
                .map(task -> ResponseEntity.ok(modelMapper.map(task, TaskResponseDto.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cart/remove")
    public ResponseEntity<TaskResponseDto> removeFromCart(@PathVariable Long id) {
        Optional<Task> updatedTask = service.removeFromCart(id);
        return updatedTask
                .map(task -> ResponseEntity.ok(modelMapper.map(task, TaskResponseDto.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TaskResponseDto createTask(@RequestBody @Valid TaskRequestDto taskRequestDto,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Task task = modelMapper.map(taskRequestDto, Task.class);
        task.setUser(user);

        Task savedTask = service.save(task);
        return modelMapper.map(savedTask, TaskResponseDto.class);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        if (service.findById(taskId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(taskId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/offered")
    public List<TaskResponseDto> getOfferedTasks(@AuthenticationPrincipal UserPrincipal principal) {
        return service.getOfferedTasks(principal.getId()).stream()
                .map(task -> modelMapper.map(task, TaskResponseDto.class))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/offered/add")
    public ResponseEntity<TaskResponseDto> addToOffered(@PathVariable Long id) {
        Optional<Task> updatedTask = service.addToOffered(id);
        return updatedTask
                .map(task -> ResponseEntity.ok(modelMapper.map(task, TaskResponseDto.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/offered/remove")
    public ResponseEntity<TaskResponseDto> removeFromOffered(@PathVariable Long id) {
        Optional<Task> updatedTask = service.removeFromOffered(id);
        return updatedTask
                .map(task -> ResponseEntity.ok(modelMapper.map(task, TaskResponseDto.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable Long id,
                                                      @RequestBody TaskRequestDto updatedTaskDto) {
        return service.findById(id)
                .map(existingTask -> {
                    modelMapper.map(updatedTaskDto, existingTask);
                    Task updatedTask = service.save(existingTask);
                    return ResponseEntity.ok(modelMapper.map(updatedTask, TaskResponseDto.class));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
