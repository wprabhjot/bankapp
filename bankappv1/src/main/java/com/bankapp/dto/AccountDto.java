package com.bankapp.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDto {

	private String id;
	@NotBlank(message = "Name must not be blank")
	@Size(max = 50, message = "Name must be less than 50 characters")
	private String name;

	@NotNull(message = "Balance must not be null")
	@PositiveOrZero(message = "Balance must be zero or positive")
	private BigDecimal balance;
}