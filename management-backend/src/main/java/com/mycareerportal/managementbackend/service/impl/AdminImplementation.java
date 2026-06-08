package com.mycareerportal.managementbackend.service.impl;

import com.mycareerportal.managementbackend.entity.AdminUser;
import com.mycareerportal.managementbackend.repository.AdminRepository;
import com.mycareerportal.managementbackend.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminImplementation implements AdminService {

    private final AdminRepository adminRepository;

    public AdminImplementation(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public ResponseEntity<?> adminloginbyemail(String email, String password) {
        Optional<AdminUser> adminUser = adminRepository.findByEmailAndPassword(email, password);

        if(adminUser.isPresent()) {

            AdminUser admin = adminUser.get();

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Login Success");
            response.put("id", admin.getId());
            response.put("name", admin.getName());
            response.put("email", admin.getEmail());
            response.put("role", admin.getRole());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401)
                .body("Invalid Email or Password");
    }

    @Override
    public boolean checkAdminCredentials(
            String email,
            String password
    ) {

        return adminRepository
                .findByEmailAndPassword(
                        email,
                        password
                )
                .isPresent();
    }

    @Override
    public ResponseEntity<?> getAdminByEmail(
            String email
    ) {

        Optional<AdminUser> adminData =
                adminRepository.findByEmail(email);

        if(adminData.isPresent()) {

            AdminUser adminUser = adminData.get();

            Map<String, Object> response =
                    new HashMap<>();

            response.put("id", adminUser.getId());
            response.put("name", adminUser.getName());
            response.put("email", adminUser.getEmail());
            response.put("role", adminUser.getRole());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("User Not Found");
    }
}
