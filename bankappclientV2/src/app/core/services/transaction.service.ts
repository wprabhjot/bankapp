import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
  TransactionResponse,
  TransferResponse
} from '../models/transaction.model';
import { PendingApprovalResponse } from '../models/approval.model';
import { AccountService } from './account.service'; // <-- inject this

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService); // <-- inject AccountService
  private baseUrl = `${environment.apiUrl}/transactions`;

  deposit(deposit: DepositRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.baseUrl}/deposit`, deposit);
  }

  withdraw(withdraw: WithdrawRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.baseUrl}/withdraw`, withdraw);
  }

  transfer(transfer: TransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.baseUrl}/transfer`, transfer);
  }

  getTransactionsByAccount(accountId: string): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/account/${accountId}`);
  }

  getTransactionsByClerk(clerkUserId: string): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/clerk/${clerkUserId}`);
  }

  getPendingApprovals(): Observable<PendingApprovalResponse[]> {
    return this.http.get<PendingApprovalResponse[]>(`${this.baseUrl}/pending-approvals`);
  }

  getRecentTransactions(limit: number = 5, isManager: boolean = false, clerkAccountId?: string): Observable<TransactionResponse[]> {
    if (isManager) {
      return this.accountService.getAllAccounts().pipe(
        map(accounts => accounts.map(acc => acc.id)),
        switchMap(accountIds => {
          const observables = accountIds.map(id => this.getTransactionsByAccount(id));
          return forkJoin(observables);
        }),
        map(arrays => arrays.flat()),
        map(transactions =>
          transactions
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit)
        )
      );
    } else if (clerkAccountId) {
      return this.getTransactionsByAccount(clerkAccountId).pipe(
        map(transactions =>
          transactions
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit)
        )
      );
    } else {
      return of([]); // no data
    }
  }
}
