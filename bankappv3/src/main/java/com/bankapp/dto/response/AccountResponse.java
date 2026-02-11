package com.bankapp.dto.response;

import java.math.BigDecimal;

import com.bankapp.enums.AccountStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {

    private String id;
    private String name;
    private String email;
    private String phone;
    private BigDecimal balance;
    private AccountStatus status;
}