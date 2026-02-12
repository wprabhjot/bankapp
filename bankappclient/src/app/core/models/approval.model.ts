/**
 * Approval request (used for approve / reject)
 */
export interface ApprovalRequest {
  transactionId: string;
}

/**
 * Pending approval response (Manager view)
 */
export interface PendingApprovalResponse {
  transactionId: string;
  accountId: string;
  accountName: string;
  amount: number;
  transactionType: string;     // DEPOSIT, WITHDRAW, TRANSFER
  performedByUserId: string;
  createdAt: string;           // LocalDateTime → ISO string
}
