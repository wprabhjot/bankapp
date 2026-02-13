import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionResponse } from '../../../models/transaction.model';
import { AccountService } from '../../../services/account.service';
import { AccountResponse } from '../../../models/account.model';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // for [formGroup]
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class TransactionListComponent implements OnInit {

  transactions: TransactionResponse[] = [];
  accounts: AccountResponse[] = [];
  selectedAccountId: string = '';
  isManager: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  page = 1;
  readonly pageSize = 10;

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isManager = this.authService.getUserRole() === Role.ROLE_MANAGER;
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => this.accounts = accounts,
      error: () => this.errorMessage = 'Failed to load accounts.'
    });
  }

  loadTransactions(): void {
    if (!this.selectedAccountId) {
      this.transactions = [];
      return;
    }

    this.loading = true;
    this.transactionService.getTransactionsByAccount(this.selectedAccountId).subscribe({
      next: (data) => {
        this.transactions = data;
        this.page = 1;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load transactions.';
        this.loading = false;
      }
    });
  }

  get pagedTransactions(): TransactionResponse[] {
    const start = (this.page - 1) * this.pageSize;
    return this.transactions.slice(start, start + this.pageSize);
  }

  get hasPrev(): boolean {
    return this.page > 1;
  }

  get hasNext(): boolean {
    return this.page * this.pageSize < this.transactions.length;
  }

  prevPage(): void {
    if (this.hasPrev) {
      this.page--;
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.page++;
    }
  }

}
