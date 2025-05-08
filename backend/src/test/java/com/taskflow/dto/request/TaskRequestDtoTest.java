import com.taskflow.dto.request.TaskRequestDto;
import com.taskflow.entity.Task.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.validation.*;
import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class TaskRequestDtoTest {
    private Validator validator;

    @BeforeEach
    void setup() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void testValidTask() {
        TaskRequestDto dto = new TaskRequestDto();
        dto.setTitle("Task Title");
        dto.setDescription("Optional description");
        dto.setDueDate(LocalDateTime.now().plusDays(1));
        dto.setPriority("HIGH");

        Set<ConstraintViolation<TaskRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testMissingRequiredFields() {
        TaskRequestDto dto = new TaskRequestDto();

        Set<ConstraintViolation<TaskRequestDto>> violations = validator.validate(dto);
        assertEquals(3, violations.size()); // title, dueDate, priority
    }
}
