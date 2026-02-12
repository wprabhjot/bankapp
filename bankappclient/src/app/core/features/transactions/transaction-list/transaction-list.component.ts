import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionResponse } from '../../../models/transaction.model';
import { AccountService } from '../../../services/account.service';
import { AccountResponse } from '../../../models/account.model';
import { AuthService } from '../../../services/auth.service';
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

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isManager = this.authService.getUserRole() === 'ROLE_MANAGER';
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => this.accounts = accounts,
      error: (err) => this.errorMessage = 'Failed to load accounts.'
    });
  }

  onAccountChange(): void {
    if (!this.selectedAccountId) {
      this.transactions = [];
      return;
    }

    this.loading = true;
    this.transactionService.getTransactionsByAccount(this.selectedAccountId).subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load transactions.';
        this.loading = false;
      }
    });
  }

}
