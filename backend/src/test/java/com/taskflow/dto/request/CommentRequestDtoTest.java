import com.taskflow.dto.request.CommentRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.validation.*;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class CommentRequestDtoTest {
    private Validator validator;

    @BeforeEach
    void setup() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void testValidComment() {
        CommentRequestDto dto = new CommentRequestDto();
        dto.setContent("This is a comment");
        dto.setTaskId(1L);
        dto.setUserId(2L);

        Set<ConstraintViolation<CommentRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testMissingFields() {
        CommentRequestDto dto = new CommentRequestDto();

        Set<ConstraintViolation<CommentRequestDto>> violations = validator.validate(dto);
        assertEquals(3, violations.size());
    }
}
