import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../services/user.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatMenuModule
  ]
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'currentRole', 'actions'];
  roleOptions = ['ADMIN', 'SENDER', 'DRIVER'];

  roleControls: { [key: number]: FormControl } = {};

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        users.forEach(user => {
          this.roleControls[user.id] = new FormControl(user.role);
        });
      },
      error: (err) => this.showError('Failed to load users')
    });
  }

  updateStatus(id: number, newRole: User['role']): void {
      this.userService.updateUserRole(id, { role: newRole }).subscribe({
        next: () => {
          this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: () => this.showError('Failed to update status')
      });
    }

  updateRole(userId: number): void {
    const newRole = this.roleControls[userId].value;
    this.userService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        this.snackBar.open('Role updated successfully', 'Close', { duration: 3000 });
        this.loadUsers(); // Refresh the list
      },
      error: () => this.showError('Failed to update role')
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: () => this.showError('Failed to delete user')
      });
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
