import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { AccountResponse } from '../../../models/account.model';
import { DepositRequest } from '../../../models/transaction.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // for [formGroup]
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class DepositComponent implements OnInit {
  depositForm: FormGroup;
  accounts: AccountResponse[] = [];
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {
    this.depositForm = this.fb.group({
      accountId: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load accounts';
      }
    });
  }

  onSubmit(): void {
    if (this.depositForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const deposit: DepositRequest = this.depositForm.value;

    this.transactionService.deposit(deposit).subscribe({
      next: (res) => {
        this.successMessage = `Deposit of ${res.amount} to account ${res.accountId} successful!`;
        this.depositForm.reset();
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Deposit failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
