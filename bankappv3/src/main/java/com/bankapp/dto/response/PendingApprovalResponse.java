package com.bankapp.dto.response;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bankapp.enums.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingApprovalResponse {
    private String transactionId;
    private String accountId;
    private String accountName;
    private BigDecimal amount;
    private TransactionType transactionType;
    private String performedByUserId;
    private LocalDateTime createdAt;
}