package com.bankapp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankapp.dto.request.ApprovalRequest;
import com.bankapp.dto.response.PendingApprovalResponse;
import com.bankapp.dto.response.TransactionResponse;
import com.bankapp.service.ApprovalService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v2/approvals")
@AllArgsConstructor
@Validated
public class ApprovalController {

	private final ApprovalService approvalService;

	@GetMapping("/pending")
	public ResponseEntity<List<PendingApprovalResponse>> getPendingApprovals() {
		List<PendingApprovalResponse> responses = approvalService.getPendingApprovals();
		return ResponseEntity.ok(responses);
	}

	@PostMapping("/approve")
	public ResponseEntity<TransactionResponse> approveWithdrawal(@Valid @RequestBody ApprovalRequest request) {

		TransactionResponse response = approvalService.approveWithdrawal(request);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/reject")
	public ResponseEntity<TransactionResponse> rejectWithdrawal(@Valid @RequestBody ApprovalRequest request) {

		TransactionResponse response = approvalService.rejectWithdrawal(request);
		return ResponseEntity.ok(response);
	}
}
