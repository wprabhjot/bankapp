import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  Role = Role;   // 👈 ADD THIS LINE

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUsername(): string | null {
    return this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
  }

  hasRole(role: Role): boolean {
    return this.authService.hasRole(role);
  }
}

