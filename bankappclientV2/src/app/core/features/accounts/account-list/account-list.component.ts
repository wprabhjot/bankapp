import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; 
import { AccountService } from '../../../services/account.service';
import { AccountResponse } from '../../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: AccountResponse[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
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
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
