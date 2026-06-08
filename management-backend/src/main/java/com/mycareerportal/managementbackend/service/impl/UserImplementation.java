package com.mycareerportal.managementbackend.service.impl;

import com.mycareerportal.managementbackend.dto.*;
import com.mycareerportal.managementbackend.entity.Users;
import com.mycareerportal.managementbackend.repository.UserRepository;
import com.mycareerportal.managementbackend.service.OtpService;
import com.mycareerportal.managementbackend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserImplementation implements UserService {

    private final UserRepository userRepository;
    private final OtpService otpService;

    public UserImplementation(UserRepository userRepo, OtpService otpService) {

        this.userRepository = userRepo;
        this.otpService = otpService;
    }

    @Override
    public ResponseEntity<?> userloginbyemail(String email, String password) {
        Optional<Users> user = userRepository.findByEmailAndPassword(email, password);

        if(user.isPresent()) {

            Users responseUser = user.get();

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Login Success");
            response.put("id", responseUser.getId());
            response.put("name", responseUser.getFullname());
            response.put("email", responseUser.getEmail());
            response.put("phone", responseUser.getPhone());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401)
                .body("Invalid Email or Password");
    }

    @Override
    public ResponseEntity<?> userregister(
            SignUpDataDTO signUpDataDTO
    ) {


        // Check Existing Phone
        if(userRepository.existsByPhone(
                signUpDataDTO.getPhone()
        )) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Phone number already exists");
        }

        // Check existing email
        if(userRepository.existsByEmail(
                signUpDataDTO.getEmail()
        )) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        Users user = new Users();

        user.setFullname(signUpDataDTO.getName());
        user.setPhone(signUpDataDTO.getPhone());
        user.setEmail(signUpDataDTO.getEmail());
        user.setPassword(signUpDataDTO.getPassword());

        userRepository.save(user);

        return ResponseEntity.ok(
                "Registration Successful"
        );
    }

    @Override
    public boolean checkUserCredentials(
            String email,
            String password
    ) {

        return userRepository
                .findByEmailAndPassword(
                        email,
                        password
                )
                .isPresent();
    }

    @Override
    public ResponseEntity<?> getUserByEmail(
            String email
    ) {

        Optional<Users> userData =
                userRepository.findByEmail(email);

        if(userData.isPresent()) {

            Users user = userData.get();

            Map<String, Object> response =
                    new HashMap<>();

            response.put("id", user.getId());
            response.put("name", user.getFullname());
            response.put("email", user.getEmail());
            response.put("phone", user.getPhone());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("User Not Found");
    }


    @Override
    public ResponseEntity<?> sendSignupOtp(
            SignUpDataDTO dto
    ) {

        // CHECK PHONE
        if(userRepository.existsByPhone(
                dto.getPhone()
        )) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Phone already exists");
        }

        // CHECK EMAIL
        if(userRepository.existsByEmail(
                dto.getEmail()
        )) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }


        otpService.generateOtp(
                dto.getEmail()
        );

        return ResponseEntity.ok(
                "OTP Sent Successfully"
        );
    }

    @Override
    public ResponseEntity<?> verifySignupOtp(
            VerifySignupOtpDTO dto
    ) {

        boolean validOtp =
                otpService.verifyOtp(
                        dto.getEmail(),
                        dto.getOtp()
                );

        if(!validOtp) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid OTP");
        }

        // CHECK AGAIN FOR SAFETY

        if(userRepository.existsByEmail(
                dto.getEmail()
        )) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        if(userRepository.existsByPhone(
                dto.getPhone()
        )) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Phone already exists");
        }

        // SAVE USER

        Users user = new Users();

        Random random = new Random();

        long sixDigitId = 100000 + random.nextInt(900000);

        user.setId(sixDigitId);

        user.setFullname(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());

        userRepository.save(user);

        return ResponseEntity.ok(
                "Registration Successful"
        );
    }

    @Override
    public ResponseEntity<?> sendResetOtp(String email) {

        Optional<Users> user =
                userRepository.findByEmail(email);

        if(user.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Email Not Found");
        }

        otpService.generateOtp(email);

        return ResponseEntity.ok(
                "OTP Sent Successfully"
        );
    }

    @Override
    public ResponseEntity<?> resetPassword(
            ResetPasswordDTO dto
    ) {

        boolean validOtp =
                otpService.verifyOtp(
                        dto.getEmail(),
                        dto.getOtp()
                );

        if(!validOtp) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid OTP");
        }

        Optional<Users> optionalUser =
                userRepository.findByEmail(
                        dto.getEmail()
                );

        if(optionalUser.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User Not Found");
        }

        Users user = optionalUser.get();

        user.setPassword(
                dto.getNewPassword()
        );

        userRepository.save(user);

        return ResponseEntity.ok(
                "Password Updated Successfully"
        );
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {

        List<Users> users = userRepository.findAll();

        List<UserResponseDTO> response = new ArrayList<>();

        for(Users user : users) {

            UserResponseDTO dto = new UserResponseDTO();

            dto.setId(user.getId());
            dto.setFullname(user.getFullname());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPhone());
            dto.setRole(user.getRole());
            dto.setPassword(user.getPassword());

            response.add(dto);
        }

        return response;
    }

    @Override
    public void deleteUser(Long id) {

        userRepository.deleteById(id);

    }

    @Override
    public Optional<UserResponseDTO> getUserById(Long id) {

        Optional<Users> optionalUser =
                userRepository.findById(id);

        if(optionalUser.isEmpty()) {

            return Optional.empty();
        }

        Users user = optionalUser.get();

        UserResponseDTO dto =
                new UserResponseDTO();

        dto.setId(user.getId());
        dto.setFullname(user.getFullname());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setPassword(user.getPassword());

        return Optional.of(dto);
    }

    @Override
    public UserResponseDTO updateUser(
            Long id,
            UpdateUserDTO updatedUser
    ) {

        Users existingUser =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("User Not Found")
                        );

        existingUser.setFullname(
                updatedUser.getFullname()
        );

        existingUser.setEmail(
                updatedUser.getEmail()
        );

        existingUser.setPhone(
                updatedUser.getPhone()
        );

        existingUser.setPassword(
                updatedUser.getPassword()
        );

        Users savedUser =
                userRepository.save(existingUser);

        UserResponseDTO response =
                new UserResponseDTO();

        response.setId(savedUser.getId());
        response.setFullname(savedUser.getFullname());
        response.setEmail(savedUser.getEmail());
        response.setPhone(savedUser.getPhone());
        response.setPassword(savedUser.getPassword());

        return response;
    }
}
