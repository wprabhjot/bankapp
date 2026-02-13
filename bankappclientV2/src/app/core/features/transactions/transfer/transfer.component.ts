import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { AccountResponse } from '../../../models/account.model';
import { TransferRequest } from '../../../models/transaction.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // for [formGroup]
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/user.model';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TransferComponent implements OnInit {
  transferForm: FormGroup;
  accounts: AccountResponse[] = [];
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {
    this.transferForm = this.fb.group({
      senderAccountId: ['', Validators.required],
      receiverAccountId: ['', Validators.required],
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
    if (this.transferForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const transfer: TransferRequest = this.transferForm.value;

    const isManager = this.authService.hasRole(Role.ROLE_MANAGER);
    const amount = transfer.amount ?? 0;

    this.transactionService.transfer(transfer).subscribe({
      next: (res) => {
        const requiresApproval = !isManager && amount > 200000;

        if (requiresApproval) {
          this.successMessage = `Transfer of ${res.amount} from account ${res.senderAccountId} to ${res.receiverAccountId} submitted for manager approval.`;
        } else {
          this.successMessage = `Transferred ${res.amount} from account ${res.senderAccountId} to ${res.receiverAccountId} successfully!`;
        }

        this.transferForm.reset();
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Transfer failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
