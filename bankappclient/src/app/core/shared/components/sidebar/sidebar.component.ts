import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();
  Role = Role;

  isLoggedIn = false;
  username: string | null = null;
  userRole: Role | null = null;

  isCollapsed = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.updateUserState();
  }

  private updateUserState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUsername();
    this.userRole = this.authService.getUserRole();
  }

  hasRole(role: Role): boolean {
    return this.authService.hasRole(role);
  }

  logout(): void {
    this.authService.logout();
    this.updateUserState();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  emitToggle(): void {
  this.toggle.emit();
}

};


