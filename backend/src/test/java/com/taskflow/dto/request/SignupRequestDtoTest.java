import com.taskflow.dto.request.SignupRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.validation.*;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class SignupRequestDtoTest {
    private Validator validator;

    @BeforeEach
    void setup() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void testValidSignup() {
        SignupRequestDto dto = new SignupRequestDto();
        dto.setUsername("newuser");
        dto.setEmail("user@example.com");
        dto.setPassword("strongpassword");

        Set<ConstraintViolation<SignupRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testBlankFields() {
        SignupRequestDto dto = new SignupRequestDto();

        Set<ConstraintViolation<SignupRequestDto>> violations = validator.validate(dto);
        assertEquals(3, violations.size());
    }
}
