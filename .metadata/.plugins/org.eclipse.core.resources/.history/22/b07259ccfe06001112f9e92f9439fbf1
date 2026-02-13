package com.bankapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankapp.dto.request.AccountRequestDto;
import com.bankapp.dto.response.AccountResponse;
import com.bankapp.service.AccountService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v2/accounts")
@AllArgsConstructor
public class AccountController {
	private final AccountService accountService;

	@PostMapping
	public ResponseEntity<AccountResponse> createAccount(@RequestBody AccountRequestDto request) {
		AccountResponse createdAccount = accountService.createAccount(request);
		return new ResponseEntity<>(createdAccount, HttpStatus.CREATED);
	}

	@PutMapping("/{accountId}")
	public ResponseEntity<AccountResponse> updateAccount(@PathVariable String accountId,
			@RequestBody AccountRequestDto request) {
		AccountResponse updatedAccount = accountService.updateAccountDetails(accountId, request);
		return ResponseEntity.ok(updatedAccount);
	}
	
	@DeleteMapping("/{accountId}")
    public ResponseEntity<AccountResponse> deleteAccount(@PathVariable String accountId) {
        AccountResponse deletedAccount = accountService.deleteAccount(accountId);
        return ResponseEntity.ok(deletedAccount);
    }
	
	
	@GetMapping("/{accountId}")
	public ResponseEntity<AccountResponse> getAccountByIdResponse(@PathVariable String accountId){
		AccountResponse account = accountService.getAccountByIdResponse(accountId);
		return ResponseEntity.ok(account);
	}
	
	@GetMapping
	public ResponseEntity<List<AccountResponse>> getAllAccounts(){
		List<AccountResponse> allAccounts = accountService.getAllAccounts();
		return new ResponseEntity<>(allAccounts, HttpStatus.OK);
	}
}
