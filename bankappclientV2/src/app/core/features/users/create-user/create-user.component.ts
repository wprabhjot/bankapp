import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { Role } from '../../../models/user.model';
import { CreateUserRequest } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // for [formGroup]
import { FormsModule } from '@angular/forms';     

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class CreateUserComponent {
  createUserForm: FormGroup;
  roles = Object.values(Role); // ROLE_MANAGER, ROLE_CLERK
  error: string | null = null;
  success: string | null = null;
  loading = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['', Validators.required],
      role: [Role.ROLE_CLERK, Validators.required] // default to clerk
    });
  }

  onSubmit(): void {
    this.error = null;
    this.success = null;

    if (this.createUserForm.invalid) return;

    const payload: CreateUserRequest = this.createUserForm.value;

    this.loading = true;
    this.userService.createUser(payload).subscribe({
      next: (res) => {
        this.success = `User "${res.username}" created successfully!`;
        this.createUserForm.reset({ role: Role.ROLE_CLERK });
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to create user';
        this.loading = false;
      }
    });
  }
}
