// admin.guard.ts (for role-based protection)
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    if (user && user.role === 'DRIVER') {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
