package com.bankapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankapp.dto.request.DepositRequest;
import com.bankapp.dto.request.TransferRequest;
import com.bankapp.dto.request.WithdrawRequest;
import com.bankapp.dto.response.PendingApprovalResponse;
import com.bankapp.dto.response.TransactionResponse;
import com.bankapp.dto.response.TransferResponse;
import com.bankapp.service.TransactionService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v2/transactions")
@AllArgsConstructor
@Validated
public class TransactionController {

	private TransactionService transactionService;

	@PostMapping("/deposit")
	public ResponseEntity<TransactionResponse> deposit(@Valid @RequestBody DepositRequest depositRequestDto) {
		TransactionResponse transactionResponse = transactionService.deposit(depositRequestDto);
		return new ResponseEntity<>(transactionResponse, HttpStatus.CREATED);
	}

	@PostMapping("/withdraw")
	public ResponseEntity<TransactionResponse> withdraw(@Valid @RequestBody WithdrawRequest withdrawRequestDto) {
		TransactionResponse transactionResponse = transactionService.withdraw(withdrawRequestDto);
		return new ResponseEntity<>(transactionResponse, HttpStatus.CREATED);
	}

	@PostMapping("/transfer")
	public ResponseEntity<TransferResponse> transfer(@Valid @RequestBody TransferRequest transferRequest) {
		TransferResponse transactionResponse = transactionService.transfer(transferRequest);
		return new ResponseEntity<>(transactionResponse, HttpStatus.CREATED);
	}

	@GetMapping("/account/{accountId}")
	public ResponseEntity<List<TransactionResponse>> getTransactionsByAccount(@PathVariable String accountId) {

		List<TransactionResponse> transactions = transactionService.getTransactionsByAccount(accountId);

		return ResponseEntity.ok(transactions);
	}

	@GetMapping("/clerk/{clerkUserId}")
	public ResponseEntity<List<TransactionResponse>> getTransactionsByClerk(@PathVariable String clerkUserId) {

		List<TransactionResponse> transactions = transactionService.getTransactionsByClerk(clerkUserId);

		return ResponseEntity.ok(transactions);
	}
	
	@GetMapping("/pending-approvals")
    public ResponseEntity<List<PendingApprovalResponse>> getPendingApprovals() {

        List<PendingApprovalResponse> pending =
                transactionService.getPendingApprovals();

        return ResponseEntity.ok(pending);
    }
}
