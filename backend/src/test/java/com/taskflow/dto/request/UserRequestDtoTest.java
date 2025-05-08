import com.taskflow.dto.request.UserRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.validation.*;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class UserRequestDtoTest {
    private Validator validator;

    @BeforeEach
    void setup() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void testValidUser() {
        UserRequestDto dto = new UserRequestDto();
        dto.setUsername("testuser");
        dto.setEmail("user@example.com");
        dto.setPassword("password123");

        Set<ConstraintViolation<UserRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testInvalidEmail() {
        UserRequestDto dto = new UserRequestDto();
        dto.setUsername("testuser");
        dto.setEmail("not-an-email");
        dto.setPassword("password123");

        Set<ConstraintViolation<UserRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }
}
