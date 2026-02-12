import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserResponse, Role } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserListComponent implements OnInit {
  users: UserResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load users';
        this.loading = false;
      }
    });
  }

  formatRole(role: Role): string {
    // Optional: make it more readable
    switch (role) {
      case Role.ROLE_MANAGER: return 'Manager';
      case Role.ROLE_CLERK: return 'Clerk';
      default: return role;
    }
  }
}
