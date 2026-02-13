import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingApprovalsComponent } from '../../transactions/pending-approvals/pending-approvals.component';

@Component({
  selector: 'app-approvals-page',
  standalone: true,
  imports: [CommonModule, PendingApprovalsComponent],
  templateUrl: './approvals-page.component.html',
  styleUrls: ['./approvals-page.component.css']
})
export class ApprovalsPageComponent {}

