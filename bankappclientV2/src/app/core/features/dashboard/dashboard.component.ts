import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/user.model';
import { AccountResponse } from '../../models/account.model';
import { TransactionResponse } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalAccounts: number = 0;
  totalTransactions: number = 0;
  recentTransactions: TransactionResponse[] = [];

  loadingAccounts = false;
  loadingTransactions = false;
  transactionsError: string | null = null;

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadingAccounts = true;
    this.accountService.getAllAccounts().subscribe({
      next: (accounts: AccountResponse[]) => {
        this.totalAccounts = accounts.length;
        this.loadingAccounts = false;
      },
      error: () => {
        this.loadingAccounts = false;
      }
    });

    const isManager = this.authService.getUserRole() === Role.ROLE_MANAGER;
    this.loadingTransactions = true;
    this.transactionsError = null;

    this.transactionService.getRecentTransactionsSummary(5, isManager).subscribe({
      next: summary => {
        this.totalTransactions = summary.total;
        this.recentTransactions = summary.items;
        this.loadingTransactions = false;
      },
      error: () => {
        this.transactionsError = 'Failed to load recent transactions.';
        this.loadingTransactions = false;
      }
    });
  }

}
