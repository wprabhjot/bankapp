import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { AccountRequest, AccountResponse } from '../../../models/account.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  accountForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('\\d{10}')]],
      balance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  submit() {
    if (this.accountForm.invalid) return;

    this.isSubmitting = true;

    // Reset previous server errors
    Object.keys(this.accountForm.controls).forEach(key => {
      const control = this.accountForm.get(key);
      if (control?.hasError('serverError')) {
        control.setErrors(null);
      }
    });

    const accountRequest: AccountRequest = this.accountForm.value;

    this.accountService.createAccount(accountRequest)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res: AccountResponse) => {
          this.snackBar.open(
            `✅ Account created successfully! ID: ${res.id}`,
            'Close',
            { duration: 4000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] }
          );

          // Reset form and errors
          this.accountForm.reset({ balance: 0 });
        },
        error: (err) => {
          console.error(err);

          const message = err?.error?.detail || err?.error?.message || 'Failed to create account';

          // Show SnackBar
          this.snackBar.open(message, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });

          // Assign server errors to specific fields if possible
          if (message.toLowerCase().includes('email')) {
            this.accountForm.get('email')?.setErrors({ serverError: message });
          }
          if (message.toLowerCase().includes('phone')) {
            this.accountForm.get('phone')?.setErrors({ serverError: message });
          }
        }
      });
  }
}
