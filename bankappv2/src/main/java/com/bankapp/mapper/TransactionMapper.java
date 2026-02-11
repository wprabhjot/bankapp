package com.bankapp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bankapp.dto.response.PendingApprovalResponse;
import com.bankapp.dto.response.TransactionResponse;
import com.bankapp.entities.Transaction;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "account.id", target = "accountId")
    @Mapping(source = "account.name", target = "accountName")
    @Mapping(source = "transactionType", target = "type")
    @Mapping(source = "approvalStatus", target = "approvalStatus")
    @Mapping(source = "performedByUserId", target = "performedBy")
    @Mapping(source = "approvedByUserId", target = "approvedBy")
    TransactionResponse toTransactionResponse(Transaction transaction);

    @Mapping(source = "id", target = "transactionId")
    @Mapping(source = "account.id", target = "accountId")
    @Mapping(source = "account.name", target = "accountName")
    PendingApprovalResponse toPendingApprovalResponse(Transaction transaction);
}
