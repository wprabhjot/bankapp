package com.bankapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @NotBlank
	private String fullName;
    private boolean active;
    
}