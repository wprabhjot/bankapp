/**
 * Create Clerk / User request (Manager only)
 */
export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  role: Role;   // Must match backend Role enum
}

/**
 * Update user request
 */
export interface UpdateUserRequest {
  fullName: string;
  active: boolean;
}

/**
 * User response returned from backend
 */
export interface UserResponse {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  createdAt: string;   // LocalDateTime → ISO string
  active: boolean;
}

/**
 * Role type (must match Spring Security roles)
 */
export enum Role {
  ROLE_MANAGER = 'ROLE_MANAGER',
  ROLE_CLERK = 'ROLE_CLERK'
}

