import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.css']
})
export class TransactionsPageComponent {

  // Define the mini-navigation tabs
  transactionTabs = [
    { label: 'Deposit', path: 'deposit', icon: 'arrow_downward' },
    { label: 'Withdraw', path: 'withdraw', icon: 'arrow_upward' },
    { label: 'Transfer', path: 'transfer', icon: 'swap_horiz' },
    { label: 'Pending Approvals', path: 'pending-approvals', icon: 'pending_actions' }
  ];

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([`/transactions/${path}`]);
  }
}
