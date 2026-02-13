import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { AccountResponse } from '../../../models/account.model';
import { TransactionResponse } from '../../../models/transaction.model';
import { Role } from '../../../models/user.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: AccountResponse[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  isManager = false;

  // Edit account
  editingAccount: AccountResponse | null = null;
  editForm!: FormGroup;
  editSubmitting = false;
  editError: string | null = null;

  // Transactions modal
  showTransactionsModal = false;
  modalAccount: AccountResponse | null = null;
  modalTransactions: TransactionResponse[] = [];
  transactionsLoading = false;
  transactionsError: string | null = null;
  txnPage = 1;
  readonly txnPageSize = 10;

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isManager = this.authService.getUserRole() === Role.ROLE_MANAGER;
    this.initEditForm();
    this.loadAccounts();
  }

  private initEditForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern('\\d{10}')]]
    });
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (data: AccountResponse[]) => {
        this.accounts = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load accounts';
        this.isLoading = false;
      }
    });
  }

  // ===== Manager-only: Edit / Delete =====

  startEdit(account: AccountResponse): void {
    if (!this.isManager) {
      return;
    }
    this.editingAccount = account;
    this.editError = null;
    this.editForm.setValue({
      name: account.name,
      email: account.email ?? '',
      phone: account.phone ?? ''
    });
  }

  cancelEdit(): void {
    this.editingAccount = null;
    this.editForm.reset();
  }

  submitEdit(): void {
    if (!this.editingAccount || this.editForm.invalid) {
      return;
    }
    this.editSubmitting = true;
    this.editError = null;

    const { name, email, phone } = this.editForm.value;

    this.accountService.updateAccount(this.editingAccount.id, {
      name,
      email,
      phone
    }).subscribe({
      next: (updated) => {
        this.accounts = this.accounts.map(a => a.id === updated.id ? updated : a);
        this.editSubmitting = false;
        this.cancelEdit();
      },
      error: () => {
        this.editError = 'Failed to update account.';
        this.editSubmitting = false;
      }
    });
  }

  deleteAccount(account: AccountResponse): void {
    if (!this.isManager) {
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete account ${account.id}?`);
    if (!confirmed) {
      return;
    }

    this.accountService.deleteAccount(account.id).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(a => a.id !== account.id);
        if (this.editingAccount?.id === account.id) {
          this.cancelEdit();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to delete account.';
      }
    });
  }

  // ===== Account transactions modal =====

  openTransactionsModal(account: AccountResponse): void {
    this.modalAccount = account;
    this.showTransactionsModal = true;
    this.txnPage = 1;
    this.loadTransactionsForAccount(account.id);
  }

  closeTransactionsModal(): void {
    this.showTransactionsModal = false;
    this.modalAccount = null;
    this.modalTransactions = [];
    this.transactionsError = null;
  }

  loadTransactionsForAccount(accountId: string): void {
    this.transactionsLoading = true;
    this.transactionsError = null;
    this.transactionService.getTransactionsByAccount(accountId).subscribe({
      next: (txns) => {
        this.modalTransactions = txns;
        this.transactionsLoading = false;
      },
      error: () => {
        this.transactionsError = 'Failed to load transactions for this account.';
        this.transactionsLoading = false;
      }
    });
  }

  get pagedTransactions(): TransactionResponse[] {
    const start = (this.txnPage - 1) * this.txnPageSize;
    return this.modalTransactions.slice(start, start + this.txnPageSize);
  }

  get hasPrevPage(): boolean {
    return this.txnPage > 1;
  }

  get hasNextPage(): boolean {
    return this.txnPage * this.txnPageSize < this.modalTransactions.length;
  }

  goToPrevPage(): void {
    if (this.hasPrevPage) {
      this.txnPage--;
    }
  }

  goToNextPage(): void {
    if (this.hasNextPage) {
      this.txnPage++;
    }
  }
}
