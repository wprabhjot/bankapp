import { Routes } from '@angular/router';
import { LoginComponent } from './core/features/auth/login/login.component';
import { DashboardComponent } from './core/features/dashboard/dashboard.component';
import { CreateAccountComponent } from './core/features/accounts/create-account/create-account.component';
import { AccountListComponent } from './core/features/accounts/account-list/account-list.component';
import { DepositComponent } from './core/features/transactions/deposit/deposit.component';
import { WithdrawComponent } from './core/features/transactions/withdraw/withdraw.component';
import { TransferComponent } from './core/features/transactions/transfer/transfer.component';
import { TransactionListComponent } from './core/features/transactions/transaction-list/transaction-list.component';
import { PendingApprovalsComponent } from './core/features/transactions/pending-approvals/pending-approvals.component';
import { CreateUserComponent } from './core/features/users/create-user/create-user.component';
import { UserListComponent } from './core/features/users/user-list/user-list.component';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './core/features/layout/layout.component';
import { AccountsPageComponent } from './core/features/accounts/accounts-page/accounts-page.component';
import { UsersPageComponent } from './core/features/users/users-page/users-page.component';
import { TransactionsPageComponent } from './core/features/transactions/transactions-page/transactions-page.component';
import { Role } from './core/models/user.model';
import { ApprovalsPageComponent } from './core/features/approvals/approvals-page/approvals-page.component';

export const routes: Routes = [

  // -------------------------
  // Public route
  // -------------------------
  { path: 'login', component: LoginComponent },

  // -------------------------
  // Protected Layout
  // -------------------------
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [

      // Dashboard
      { path: '', component: DashboardComponent },

      // Accounts
      {
        path: 'accounts',
        component: AccountsPageComponent,
        children: [
          {
            path: 'create',
            component: CreateAccountComponent,
            data: { roles: [Role.ROLE_MANAGER] }
          },
          { path: 'list', component: AccountListComponent },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // Transactions
      {
        path: 'transactions',
        component: TransactionsPageComponent,
        children: [
          { path: 'deposit', component: DepositComponent },
          { path: 'withdraw', component: WithdrawComponent },
          { path: 'transfer', component: TransferComponent },
          { path: 'list', component: TransactionListComponent },
          {
            path: 'pending-approvals',
            component: PendingApprovalsComponent,
            data: { roles: [Role.ROLE_MANAGER] }
          },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // Users
      {
        path: 'users',
        component: UsersPageComponent,
        data: { roles: [Role.ROLE_MANAGER] },
        children: [
          { path: 'create', component: CreateUserComponent },
          { path: 'list', component: UserListComponent },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // Approvals (manager only)
      {
        path: 'approvals',
        component: ApprovalsPageComponent,
        data: { roles: [Role.ROLE_MANAGER] }
      }

    ]
  },

  // -------------------------
  // Fallback
  // -------------------------
  { path: '**', redirectTo: '' }
];
