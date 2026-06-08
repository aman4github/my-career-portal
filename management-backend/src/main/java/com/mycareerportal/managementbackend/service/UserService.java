package com.mycareerportal.managementbackend.service;

import com.mycareerportal.managementbackend.dto.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface UserService {
    ResponseEntity<?> userloginbyemail(String email, String password);
    ResponseEntity<?> userregister(
            SignUpDataDTO signUpDataDTO
    );

    ResponseEntity<?> getUserByEmail(String email);

    boolean checkUserCredentials(String email, String password);

    ResponseEntity<?> sendSignupOtp(
            SignUpDataDTO dto
    );

    ResponseEntity<?> verifySignupOtp(
            VerifySignupOtpDTO dto
    );

    ResponseEntity<?> sendResetOtp(String email);

    ResponseEntity<?> resetPassword(ResetPasswordDTO dto);

    List<UserResponseDTO> getAllUsers();

    void deleteUser(Long id);

    Optional<UserResponseDTO> getUserById(Long id);

    UserResponseDTO updateUser(
            Long id,
            UpdateUserDTO updatedUser
    );
}
