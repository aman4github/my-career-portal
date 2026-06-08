package com.mycareerportal.managementbackend;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ManagementBackendApplication {

    @Value("${MAIL_USERNAME:NOT_FOUND}")
    private String username;

    @PostConstruct
    public void test() {
        System.out.println("MAIL_USERNAME = " + username);
    }

    public static void main(String[] args) {
        SpringApplication.run(ManagementBackendApplication.class, args);
    }

}
