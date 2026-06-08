package com.mycareerportal.managementbackend.service;

import org.springframework.http.ResponseEntity;

public interface AdminService {
    ResponseEntity<?> adminloginbyemail(String email, String password);

    ResponseEntity<?> getAdminByEmail(String email);

    boolean checkAdminCredentials(String email, String password);
}
