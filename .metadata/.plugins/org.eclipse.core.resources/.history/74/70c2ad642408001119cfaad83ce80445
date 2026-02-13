package com.bankapp.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bankapp.dto.request.AccountRequestDto;
import com.bankapp.dto.request.UpdateAccountDetailsRequest;
import com.bankapp.dto.response.AccountResponse;
import com.bankapp.entities.Account;
import com.bankapp.enums.AccountStatus;
import com.bankapp.exceptions.BankAccountNotFoundException;
import com.bankapp.mapper.AccountMapper;
import com.bankapp.repo.AccountRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AccountService {

	private final AccountRepository accountRepository;
	private final AccountMapper accountMapper;

	public AccountService(AccountRepository accountRepository, AccountMapper accountMapper) {
		this.accountRepository = accountRepository;
		this.accountMapper = accountMapper;
	}

	public AccountResponse createAccount(AccountRequestDto request) {

		if (request.getBalance().compareTo(BigDecimal.ZERO) < 0) {
			throw new IllegalArgumentException("Initial balance cannot be negative");
		}

		Account account = accountMapper.toEntity(request);
		Account savedAccount = accountRepository.save(account);

		return accountMapper.toResponse(savedAccount);
	}

	public AccountResponse updateAccountDetails(String accountId, UpdateAccountDetailsRequest request) {

		Account account = getAccountById(accountId);

		if (account.getStatus() != AccountStatus.ACTIVE) {
			throw new IllegalArgumentException("Account is closed and cannot be updated");
		}

		account.updateDetails(request.getName(), request.getEmail(), request.getPhone());

		Account updated = accountRepository.save(account);
		return accountMapper.toResponse(updated);
	}

	public AccountResponse deleteAccount(String accountId) {

		Account account = getAccountById(accountId);
		account.close();

		Account saved = accountRepository.save(account);
		return accountMapper.toResponse(saved);
	}

	public Account getAccountById(String accountId) {
		return accountRepository.findById(accountId).orElseThrow(() -> new BankAccountNotFoundException(accountId));
	}

	public AccountResponse getAccountByIdResponse(String accountId) {
		Account account = accountRepository.findById(accountId)
				.orElseThrow(() -> new BankAccountNotFoundException(accountId));

		return accountMapper.toResponse(account);
	}

	public List<AccountResponse> getAllAccounts() {
		return accountRepository.findAll().stream().map(accountMapper::toResponse).toList();
	}
}
