package com.mycareerportal.managementbackend.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class OtpService {

    private final EmailService emailService;

    private Map<String, String> otpStorage =
            new HashMap<>();

    public OtpService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void generateOtp(String email) {

        String otp = String.valueOf(
                (int)(Math.random() * 900000) + 100000
        );

        System.out.println(otp);

        otpStorage.put(email, otp);

        emailService.sendOtpEmail(
                email,
                otp
        );
    }

    public boolean verifyOtp(
            String email,
            String otp
    ) {

        return otp.equals(
                otpStorage.get(email)
        );
    }
}