export interface AuthRequest {
  username: string;
  password: string;
}

/**
 * Your backend returns only a JWT string
 * not an object.
 * So this is optional, but useful if later backend changes.
 */
export interface AuthResponse {
  token: string;
}

/**
 * Structure of decoded JWT payload
 * (adjust if your Spring Security JWT contains different fields)
 */
export interface JwtPayload {
  sub: string;              // username
  roles?: string[];         // if roles are stored as array
  role?: string;            // if single role
  exp: number;              // expiration timestamp
  iat: number;              // issued at
}
