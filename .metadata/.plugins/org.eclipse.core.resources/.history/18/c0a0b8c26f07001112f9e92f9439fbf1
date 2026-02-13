package com.bankapp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<List<PendingApprovalResponse>> getPendingApprovals() {
		List<PendingApprovalResponse> responses = approvalService.getPendingApprovals();
		return ResponseEntity.ok(responses);
	}

	@PostMapping("/approve")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<TransactionResponse> approve(@Valid @RequestBody ApprovalRequest request) {
	    return ResponseEntity.ok(approvalService.approve(request));
	}


	@PostMapping("/reject")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<TransactionResponse> reject(@Valid @RequestBody ApprovalRequest request) {

		TransactionResponse response = approvalService.reject(request);
		return ResponseEntity.ok(response);
	}
}
