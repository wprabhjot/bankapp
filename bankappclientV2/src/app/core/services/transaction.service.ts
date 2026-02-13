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

  // Internal helper to build a complete transaction stream based on role context
  private buildTransactionStream(
    isManager: boolean,
    clerkAccountId?: string
  ): Observable<TransactionResponse[]> {
    if (isManager) {
      return this.accountService.getAllAccounts().pipe(
        map(accounts => accounts.map(acc => acc.id)),
        switchMap(accountIds => {
          if (!accountIds.length) {
            return of<TransactionResponse[]>([]);
          }
          const observables = accountIds.map(id => this.getTransactionsByAccount(id));
          return forkJoin(observables);
        }),
        map(arrays => arrays.flat())
      );
    } else if (clerkAccountId) {
      return this.getTransactionsByAccount(clerkAccountId);
    } else {
      return of<TransactionResponse[]>([]);
    }
  }

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

  /**
   * Returns the most recent transactions limited by `limit`.
   * For managers, this aggregates across all accounts.
   * For clerks, this can be scoped to a specific account via `clerkAccountId`.
   */
  getRecentTransactions(limit: number = 5, isManager: boolean = false, clerkAccountId?: string): Observable<TransactionResponse[]> {
    return this.buildTransactionStream(isManager, clerkAccountId).pipe(
      map(transactions =>
        transactions
          .slice() // avoid mutating original
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit)
      )
    );
  }

  /**
   * Returns both total count and a limited, sorted slice of recent transactions.
   * Used for dashboards where we need both metrics and a preview list.
   */
  getRecentTransactionsSummary(
    limit: number = 5,
    isManager: boolean = false,
    clerkAccountId?: string
  ): Observable<{ total: number; items: TransactionResponse[] }> {
    return this.buildTransactionStream(isManager, clerkAccountId).pipe(
      map(transactions => {
        const sorted = transactions
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return {
          total: sorted.length,
          items: sorted.slice(0, limit)
        };
      })
    );
  }
}
