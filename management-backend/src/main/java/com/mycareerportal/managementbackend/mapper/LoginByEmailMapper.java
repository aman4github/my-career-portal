package com.mycareerportal.managementbackend.mapper;

import com.mycareerportal.managementbackend.dto.LoginByEmailDTO;
import com.mycareerportal.managementbackend.entity.Users;

public class LoginByEmailMapper {
    public static LoginByEmailDTO toLoginByEmailDTO(Users user) {
        return new LoginByEmailDTO (
                user.getEmail(),
                user.getPassword()
        );
    }
}
