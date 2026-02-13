import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApprovalRequest } from '../models/approval.model';
import { TransactionResponse } from '../models/transaction.model';
import { PendingApprovalResponse } from '../models/approval.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/approvals`;

  // =============================
  // GET PENDING APPROVALS (Manager Only)
  // =============================
  getPendingApprovals(): Observable<PendingApprovalResponse[]> {
    return this.http.get<PendingApprovalResponse[]>(`${this.baseUrl}/pending`);
  }

  // =============================
  // APPROVE TRANSACTION (Manager Only)
  // =============================
  approve(request: ApprovalRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.baseUrl}/approve`, request);
  }

  // =============================
  // REJECT TRANSACTION (Manager Only)
  // =============================
  reject(request: ApprovalRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.baseUrl}/reject`, request);
  }
}
