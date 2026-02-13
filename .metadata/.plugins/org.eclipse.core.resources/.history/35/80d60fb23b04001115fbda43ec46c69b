package com.bankapp.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bankapp.enums.ApprovalStatus;
import com.bankapp.enums.TransactionType;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Transaction {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;
	
	@ManyToOne
	private Account account;
	
	@Enumerated
	private TransactionType transactionType;
	
	@Enumerated
	private ApprovalStatus approvalStatus;
	
	private BigDecimal ammount;
	
	private LocalDateTime localDateTime;
	
	private String performerdBy;
	private String ApprovedBy;
}
