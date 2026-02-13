import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // for *ngIf
import { RouterModule } from '@angular/router'; // for router-outlet
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BankApp';
  currentYear: number = new Date().getFullYear(); // <-- added
  username: string | null;

  constructor(private authService: AuthService) {
    this.username = this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
  }
}
