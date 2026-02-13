package com.bankapp.dto.response;

import java.time.LocalDateTime;

import com.bankapp.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String username;
    private String fullName;
    private Role role;
    private LocalDateTime createdAt;
    private boolean active;
}