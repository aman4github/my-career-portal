package com.mycareerportal.managementbackend.repository;

import com.mycareerportal.managementbackend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.http.ResponseEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmailAndPassword(String email, String password);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<Users> findByEmail(
            String email
    );

}
