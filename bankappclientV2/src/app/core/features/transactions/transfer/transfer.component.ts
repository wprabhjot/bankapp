import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { AccountResponse } from '../../../models/account.model';
import { TransferRequest } from '../../../models/transaction.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // for [formGroup]
import { FormsModule } from '@angular/forms';     

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
    private transactionService: TransactionService
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
      error: (err) => {
        console.error(err);
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

    this.transactionService.transfer(transfer).subscribe({
      next: (res) => {
        this.successMessage = `Transferred ${res.amount} from account ${res.senderAccountId} to ${res.receiverAccountId} successfully!`;
        this.transferForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Transfer failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
