import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { AccountResponse } from '../../../models/account.model';
import { WithdrawRequest } from '../../../models/transaction.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // for [formGroup]
import { FormsModule } from '@angular/forms';        // for [(ngModel)]


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class WithdrawComponent implements OnInit {
  withdrawForm: FormGroup;
  accounts: AccountResponse[] = [];
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {
    this.withdrawForm = this.fb.group({
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
    if (this.withdrawForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const withdraw: WithdrawRequest = this.withdrawForm.value;

    this.transactionService.withdraw(withdraw).subscribe({
      next: (res) => {
        if (res.approvalStatus === 'PENDING_APPROVAL') {
          this.successMessage = `Withdrawal of ${res.amount} from account ${res.accountId} submitted for manager approval.`;
        } else {
          this.successMessage = `Withdrawal of ${res.amount} from account ${res.accountId} successful!`;
        }
        this.withdrawForm.reset();
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Withdrawal failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
