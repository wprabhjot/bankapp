import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { PendingApprovalResponse } from '../../../models/approval.model';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending-approvals',
  templateUrl: './pending-approvals.component.html',
  styleUrls: ['./pending-approvals.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PendingApprovalsComponent implements OnInit {

  pendingApprovals: PendingApprovalResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    if (this.authService.hasRole(Role.ROLE_MANAGER)) {
      this.fetchPendingApprovals();
    } else {
      this.error = 'You are not authorized to view pending approvals.';
    }
  }

  fetchPendingApprovals(): void {
    this.loading = true;
    this.transactionService.getPendingApprovals().subscribe({
      next: (data) => {
        this.pendingApprovals = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load pending approvals';
        this.loading = false;
      }
    });
  }

  approve(transactionId: string): void {
    this.http.post(`${environment.apiUrl}/approvals/approve`, { transactionId }).subscribe({
      next: () => this.removeTransactionFromList(transactionId),
      error: () => alert('Failed to approve transaction')
    });
  }

  reject(transactionId: string): void {
    this.http.post(`${environment.apiUrl}/approvals/reject`, { transactionId }).subscribe({
      next: () => this.removeTransactionFromList(transactionId),
      error: () => alert('Failed to reject transaction')
    });
  }

  private removeTransactionFromList(transactionId: string): void {
    this.pendingApprovals = this.pendingApprovals.filter(t => t.transactionId !== transactionId);
  }
}
