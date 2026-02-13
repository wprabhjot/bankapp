import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { AccountResponse } from '../../models/account.model';
import { CommonModule } from '@angular/common'; // *ngIf, pipes
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

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (accounts: AccountResponse[]) => {
        this.totalAccounts = accounts.length;
      }
    });

    // Fetch recent transactions (last 5)
    this.transactionService.getRecentTransactions().subscribe({
      next: (transactions: TransactionResponse[]) => {
        this.totalTransactions = transactions.length;
        this.recentTransactions = transactions.slice(0, 5);
      }
    });
  }

}
