import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AccountRequest,
  UpdateAccountRequest,
  AccountResponse
} from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/accounts`;

  // =============================
  // CREATE ACCOUNT (Manager Only)
  // =============================
  createAccount(account: AccountRequest): Observable<AccountResponse> {
    return this.http.post<AccountResponse>(this.baseUrl, account);
  }

  // =============================
  // UPDATE ACCOUNT (Manager Only)
  // =============================
  updateAccount(accountId: string, account: UpdateAccountRequest): Observable<AccountResponse> {
    return this.http.put<AccountResponse>(`${this.baseUrl}/${accountId}`, account);
  }

  // =============================
  // DELETE ACCOUNT (Manager Only)
  // =============================
  deleteAccount(accountId: string): Observable<AccountResponse> {
    return this.http.delete<AccountResponse>(`${this.baseUrl}/${accountId}`);
  }

  // =============================
  // GET ACCOUNT BY ID (Manager + Clerk)
  // =============================
  getAccountById(accountId: string): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.baseUrl}/${accountId}`);
  }

  // =============================
  // GET ALL ACCOUNTS (Manager + Clerk)
  // =============================
  getAllAccounts(): Observable<AccountResponse[]> {
    return this.http.get<AccountResponse[]>(this.baseUrl);
  }
}
