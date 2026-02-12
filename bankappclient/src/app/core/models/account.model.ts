/**
 * Account creation request (Manager only)
 */
export interface AccountRequest {
  name: string;
  email: string;
  phone: string;
  balance: number;
}

/**
 * Update account request (Manager only)
 */
export interface UpdateAccountRequest {
  name: string;
  email: string;
  phone: string;
}

/**
 * Account response returned from backend
 */
export interface AccountResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  status: AccountStatus;
}

/**
 * Account status enum
 * (match with your backend AccountStatus enum values)
 */
export type AccountStatus =
  | 'ACTIVE'
  | 'CLOSED';
