package com.bankapp.mapper;

import org.mapstruct.Mapper;

import com.bankapp.dto.request.AccountRequestDto;
import com.bankapp.dto.response.AccountResponse;
import com.bankapp.entities.Account;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountResponse toResponse(Account account);
    Account toEntity(AccountRequestDto request);
}