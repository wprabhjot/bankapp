import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (!this.authService.isLoggedIn()) {
      // Not logged in → redirect to login
      return this.router.createUrlTree(['/login']);
    }

    // Optional: role-based route access
    const allowedRoles = route.data['roles'] as Role[] | undefined;
    if (allowedRoles && !allowedRoles.includes(this.authService.getUserRole()!)) {
      // Logged in but role not allowed → redirect to home or unauthorized page
      return this.router.createUrlTree(['/']);
    }

    return true;
  }
}
