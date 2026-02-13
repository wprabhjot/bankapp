package com.bankapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bankapp.dto.request.ApprovalRequest;
import com.bankapp.dto.response.PendingApprovalResponse;
import com.bankapp.dto.response.TransactionResponse;
import com.bankapp.entities.Account;
import com.bankapp.entities.Transaction;
import com.bankapp.enums.ApprovalStatus;
import com.bankapp.enums.TransactionType;
import com.bankapp.logging.Loggable;
import com.bankapp.mapper.ApprovalMapper;
import com.bankapp.mapper.TransactionMapper;
import com.bankapp.repo.AccountRepository;
import com.bankapp.repo.TransactionRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ApprovalService {

	private final TransactionRepository transactionRepository;
	private final AccountRepository accountRepository;
	private final ApprovalMapper approvalMapper;
	private final TransactionMapper transactionMapper;

	private String getCurrentManager() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}

	@Loggable
	public TransactionResponse approve(ApprovalRequest request) {

		Transaction transaction = transactionRepository.findById(request.getTransactionId())
				.orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

		if (transaction.getApprovalStatus() != ApprovalStatus.PENDING_APPROVAL) {
			throw new IllegalStateException("Transaction is not pending for approval");
		}

		String managerId = getCurrentManager();
		Account account = transaction.getAccount();

		if (transaction.getTransactionType() == TransactionType.WITHDRAWAL) {

			if (account.getBalance().compareTo(transaction.getAmount()) < 0) {
				throw new IllegalStateException("Insufficient balance");
			}

			account.debit(transaction.getAmount());
			accountRepository.save(account);
		}

		if (transaction.getTransactionType() == TransactionType.TRANSFER_OUT) {

			Account sender = account;

			Account receiver = accountRepository.findById(transaction.getRelatedAccountId())
					.orElseThrow(() -> new IllegalStateException("Receiver not found"));

			if (sender.getBalance().compareTo(transaction.getAmount()) < 0) {
				throw new IllegalStateException("Insufficient balance");
			}

			sender.debit(transaction.getAmount());
			receiver.credit(transaction.getAmount());

			accountRepository.save(sender);
			accountRepository.save(receiver);

			Transaction creditTx = transactionRepository
					.findByAccountIdAndRelatedAccountIdAndApprovalStatus(receiver.getId(), sender.getId(),
							ApprovalStatus.PENDING_APPROVAL)
					.stream().findFirst()
					.orElseThrow(() -> new IllegalStateException("Matching credit transaction not found"));

			creditTx.approve(managerId);
			transactionRepository.save(creditTx);
		}

		transaction.approve(managerId);
		transactionRepository.save(transaction);

		return transactionMapper.toTransactionResponse(transaction);
	}

	@Loggable
	public TransactionResponse reject(ApprovalRequest request) {

		Transaction transaction = transactionRepository.findById(request.getTransactionId())
				.orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

		if (transaction.getApprovalStatus() != ApprovalStatus.PENDING_APPROVAL) {
			throw new IllegalStateException("Transaction is not pending for approval");
		}

		String managerId = getCurrentManager();

		if (transaction.getTransactionType() == TransactionType.TRANSFER_OUT) {

			Transaction creditTx = transactionRepository
					.findByAccountIdAndRelatedAccountIdAndApprovalStatus(transaction.getRelatedAccountId(),
							transaction.getAccount().getId(), ApprovalStatus.PENDING_APPROVAL)
					.stream().findFirst().orElse(null);

			if (creditTx != null) {
				creditTx.reject(managerId);
				transactionRepository.save(creditTx);
			}
		}

		transaction.reject(managerId);
		transactionRepository.save(transaction);

		return transactionMapper.toTransactionResponse(transaction);
	}

	@Loggable
	public List<PendingApprovalResponse> getPendingApprovals() {

		return transactionRepository.findByApprovalStatus(ApprovalStatus.PENDING_APPROVAL).stream()
				.map(approvalMapper::toPendingApprovalResponse).collect(Collectors.toList());
	}
}
