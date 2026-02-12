/**
 * Deposit request
 */
export interface DepositRequest {
  accountId: string;
  amount: number;
}

/**
 * Withdraw request
 */
export interface WithdrawRequest {
  accountId: string;
  amount: number;
}

/**
 * Transfer request
 */
export interface TransferRequest {
  senderAccountId: string;
  receiverAccountId: string;
  amount: number;
}

/**
 * Transaction response (used in lists)
 */
export interface TransactionResponse {
  id: string;
  accountId: string;
  accountName: string;
  type: string;              // e.g. DEPOSIT, WITHDRAW, TRANSFER
  approvalStatus: string;    // PENDING, APPROVED, REJECTED, FAILED
  amount: number;
  performedBy: string;
  approvedBy: string;
  createdAt: string;         // LocalDateTime comes as ISO string
}   

/**
 * Transfer response
 */
export interface TransferResponse {
  senderAccountId: string;
  senderAccountName: string;
  receiverAccountId: string;
  receiverAccountName: string;
  amount: number;
  performedByUserId: string;
  createdAt: string;
}
