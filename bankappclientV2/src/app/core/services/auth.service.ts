import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../../environments/environment';
import { AuthRequest, JwtPayload } from '../models/auth.model';
import { Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);

  private readonly TOKEN_KEY = 'bank_jwt_token';

  private decodedToken: JwtPayload | null = null;

  // =============================
  // LOGIN
  // =============================
  login(request: AuthRequest) {
  return this.http.post(environment.authUrl, request, { responseType: 'text' });
}

  // =============================
  // STORE TOKEN
  // =============================
  saveToken(token: string): void {
    // Store in cookies (1 day expiry)
    this.cookieService.set(this.TOKEN_KEY, token, {
      path: '/',
      sameSite: 'Lax'
    });

    this.decodedToken = jwtDecode<JwtPayload>(token);
  }

  // =============================
  // GET TOKEN
  // =============================
  getToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY) || null;
  }

  // =============================
  // CHECK LOGIN
  // =============================
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }

      this.decodedToken = decoded;
      return true;

    } catch (error) {
      this.logout();
      return false;
    }
  }

  // =============================
  // LOGOUT
  // =============================
  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/');
    this.decodedToken = null;
    this.router.navigate(['/login']);
  }

  // =============================
  // GET USERNAME
  // =============================
  getUsername(): string | null {
    if (!this.decodedToken) {
      const token = this.getToken();
      if (token) {
        this.decodedToken = jwtDecode<JwtPayload>(token);
      }
    }

    return this.decodedToken?.sub || null;
  }

  // =============================
  // GET ROLE
  // =============================
  getUserRole(): Role | null {
    if (!this.decodedToken) {
      const token = this.getToken();
      if (token) {
        this.decodedToken = jwtDecode<JwtPayload>(token);
      }
    }

    // Depending on how roles are stored in JWT
    if (this.decodedToken?.roles?.length) {
      return this.decodedToken.roles[0] as Role;
    }

    if (this.decodedToken?.role) {
      return this.decodedToken.role as Role;
    }

    return null;
  }

  // =============================
  // ROLE CHECK
  // =============================
  hasRole(role: Role): boolean {
    return this.getUserRole() === role;
  }
}
