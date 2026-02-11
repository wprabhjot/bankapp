package com.bankapp.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferResponse {
    private String senderAccountId;
    private String senderAccountName;
    private String receiverAccountId;
    private String receiverAccountName;
    private BigDecimal amount;
    private String performedByUserId;
    private LocalDateTime createdAt;
}