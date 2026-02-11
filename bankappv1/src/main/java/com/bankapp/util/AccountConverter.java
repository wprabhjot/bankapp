package com.bankapp.util;

import com.bankapp.dto.AccountDto;
import com.bankapp.entities.Account;

public class AccountConverter {

    public static AccountDto convertToAccountDto(Account account) {

        if (account == null) {
            return null;
        }

        AccountDto dto = new AccountDto();
        dto.setId(account.getId());
        dto.setName(account.getName());
        dto.setBalance(account.getBalance());

        return dto;
    }

    public static Account convertToAccount(AccountDto dto) {

        if (dto == null) {
            return null;
        }

        Account account = new Account();
        account.setId(dto.getId());
        account.setName(dto.getName());
        account.setBalance(dto.getBalance());

        return account;
    }
}
