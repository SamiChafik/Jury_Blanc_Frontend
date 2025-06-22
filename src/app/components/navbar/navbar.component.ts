import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive
  ]
})
export class NavbarComponent {
  isMenuCollapsed = true;

  constructor(
      public authService: AuthService,
      private router: Router,
      private snackBar: MatSnackBar
    ) {}

  logout() {
    this.authService.removeAuthData();
    this.snackBar.open('Déconnexion réussie', 'Fermer', { duration: 3000 });
    this.router.navigate(['/login']);
  }
}
