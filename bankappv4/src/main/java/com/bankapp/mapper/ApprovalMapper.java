package com.bankapp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bankapp.dto.response.PendingApprovalResponse;
import com.bankapp.entities.Transaction;

@Mapper(componentModel = "spring")
public interface ApprovalMapper {

    @Mapping(source = "id", target = "transactionId")
    @Mapping(source = "account.id", target = "accountId")
    @Mapping(source = "account.name", target = "accountName")
    @Mapping(source = "performedByUserId", target = "performedByUserId")
    PendingApprovalResponse toPendingApprovalResponse(Transaction transaction);
}
