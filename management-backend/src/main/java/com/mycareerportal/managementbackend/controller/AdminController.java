package com.mycareerportal.managementbackend.controller;

import com.mycareerportal.managementbackend.dto.LoginByEmailDTO;
import com.mycareerportal.managementbackend.service.AdminService;
import com.mycareerportal.managementbackend.service.OtpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/management/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    private final AdminService adminService;
    private final OtpService otpService;

    public AdminController(AdminService adminService, OtpService otpService) {
        this.adminService = adminService;
        this.otpService = otpService;
    }

//    @PostMapping("/adminlogin")
//    public ResponseEntity<?> login(
//            @RequestBody LoginByEmailDTO request
//    ) {
//
//        System.out.println(request.getEmail());
//        System.out.println(request.getPassword());
//
//        return adminService.adminloginbyemail(
//                request.getEmail(),
//                request.getPassword()
//        );
//    }

    // LOGIN + SEND OTP
    @PostMapping("/adminlogin")
    public ResponseEntity<?> login(
            @RequestBody LoginByEmailDTO request
    ) {

        boolean valid = adminService
                .checkAdminCredentials(
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

        return adminService
                .getAdminByEmail(email);
    }
}
