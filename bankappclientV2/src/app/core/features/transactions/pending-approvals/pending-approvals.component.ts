import { Component, OnInit } from '@angular/core';
import { PendingApprovalResponse, ApprovalRequest } from '../../../models/approval.model';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { ApprovalService } from '../../../services/approval.service';

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
    private approvalService: ApprovalService,
    private authService: AuthService,
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
    this.approvalService.getPendingApprovals().subscribe({
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
    const payload: ApprovalRequest = { transactionId };
    this.approvalService.approve(payload).subscribe({
      next: () => this.removeTransactionFromList(transactionId),
      error: () => {
        this.error = 'Failed to approve transaction';
      }
    });
  }

  reject(transactionId: string): void {
    const payload: ApprovalRequest = { transactionId };
    this.approvalService.reject(payload).subscribe({
      next: () => this.removeTransactionFromList(transactionId),
      error: () => {
        this.error = 'Failed to reject transaction';
      }
    });
  }

  private removeTransactionFromList(transactionId: string): void {
    this.pendingApprovals = this.pendingApprovals.filter(t => t.transactionId !== transactionId);
  }
}
