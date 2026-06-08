package com.mycareerportal.managementbackend.controller;

import com.mycareerportal.managementbackend.dto.*;
import com.mycareerportal.managementbackend.entity.Users;
import com.mycareerportal.managementbackend.service.OtpService;
import com.mycareerportal.managementbackend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/management/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final OtpService otpService;

    public UserController(UserService userService, OtpService otpService) {
        this.userService = userService;
        this.otpService = otpService;
    }

//    @PostMapping("/userlogin")
//    public ResponseEntity<?> login(
//            @RequestBody LoginByEmailDTO request
//    ) {
//
//        System.out.println(request.getEmail());
//        System.out.println(request.getPassword());
//
//        return userService.userloginbyemail(
//                request.getEmail(),
//                request.getPassword()
//        );
//    }

//    @PostMapping("/userregistration")
//    public ResponseEntity<?> registerUser(
//            @RequestBody SignUpDataDTO signUpDataDTO
//    ) {
//
//        return userService
//                .userregister(signUpDataDTO);
//    }

    // LOGIN + SEND OTP
    @PostMapping("/userlogin")
    public ResponseEntity<?> login(
            @RequestBody LoginByEmailDTO request
    ) {

        boolean valid = userService
                .checkUserCredentials(
                        request.getEmail(),
                        request.getPassword()
                );

        if(!valid) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid Credentials");
        }

        // Send OTP
        otpService.generateOtp(
                request.getEmail()
        );

        return ResponseEntity.ok(
                "OTP Sent Successfully"
        );
    }

    // VERIFY OTP
    @PostMapping("/verifyotp")
    public ResponseEntity<?> verifyOtp(

            @RequestParam String email,
            @RequestParam String otp

    ) {

        boolean validOtp =
                otpService.verifyOtp(email, otp);

        if(!validOtp) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid OTP");
        }

        return userService
                .getUserByEmail(email);
    }


    @PostMapping("/send-signup-otp")
    public ResponseEntity<?> sendSignupOtp(
            @RequestBody SignUpDataDTO dto
    ) {

        return userService.sendSignupOtp(dto);
    }

    @PostMapping("/verify-signup-otp")
    public ResponseEntity<?> verifySignupOtp(
            @RequestBody VerifySignupOtpDTO dto
    ) {

        return userService.verifySignupOtp(dto);
    }

    @PostMapping("/send-reset-otp")
    public ResponseEntity<?> sendResetOtp(
            @RequestParam String email
    ) {

        return userService.sendResetOtp(email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordDTO dto
    ) {

        return userService.resetPassword(dto);
    }

    @GetMapping("/getallusers")
    public ResponseEntity<?> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @DeleteMapping("/deleteuser/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                "User Deleted Successfully"
        );
    }

    // GET USER BY ID
    @GetMapping("/getuser/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id
    ) {

        Optional<UserResponseDTO> user =
                userService.getUserById(id);

        if(user.isPresent()) {

            return ResponseEntity.ok(
                    user.get()
            );
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("User Not Found");
    }

    @PutMapping("/updateuser/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserDTO updatedUser
    ) {

        return ResponseEntity.ok(
                userService.updateUser(
                        id,
                        updatedUser
                )
        );
    }
}
