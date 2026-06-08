package com.mycareerportal.managementbackend.repository;

import com.mycareerportal.managementbackend.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByEmailAndPassword(String email, String password);

    Optional<AdminUser> findByEmail(String email);
}
