package com.taskflow.controller;

import com.taskflow.dto.request.CommentRequestDto;
import com.taskflow.dto.response.CommentResponseDto;
import com.taskflow.entity.Comment;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.CommentService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public CommentController(CommentService commentService, ModelMapper modelMapper, UserRepository userRepository) {
        this.commentService = commentService;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        if (commentService.getCommentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(
            @RequestBody @Valid CommentRequestDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Task task = commentService.getTaskById(dto.getTaskId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setTask(task);
        comment.setAuthor(user);

        Comment savedComment = commentService.createComment(comment);

        CommentResponseDto responseDto = modelMapper.map(savedComment, CommentResponseDto.class);
        responseDto.setAuthorUsername(user.getUsername());
        responseDto.setTaskId(task.getId());
        responseDto.setAuthorId(user.getId());

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable Long id,
            @RequestBody CommentRequestDto commentRequestDto) {

        Comment comment = modelMapper.map(commentRequestDto, Comment.class);
        Optional<Comment> updatedComment = commentService.updateComment(id, comment);

        return updatedComment.map(c -> ResponseEntity.ok(modelMapper.map(c, CommentResponseDto.class)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
