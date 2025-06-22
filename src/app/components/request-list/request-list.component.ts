import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../services/request.service';
import { AnnouncementService } from '../../services/announcement.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestFormComponent } from '../request-form/request-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class RequestListComponent implements OnInit {
  groupedRequests: {announcement: any, requests: any[]}[] = [];
  statusOptions = ['WAITING', 'ACCEPTED', 'REJECTED'];
  currentUser: any = null;


  constructor(
    private requestService: RequestService,
    private announcementService: AnnouncementService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.role === 'SENDER') {
      this.loadSenderRequests();
    } else {
      this.loadAllRequests();
    }

    this.currentUser = this.authService.getUser();

    if (this.authService.userUpdated$) {
      this.authService.userUpdated$.subscribe(() => {
        this.currentUser = this.authService.getUser();
      });
    }
  }

  loadAllRequests(): void {
    this.requestService.getRequests().subscribe(requests => {
      this.announcementService.getAnnouncements().subscribe(announcements => {
        this.groupedRequests = announcements.map(announcement => ({
          announcement,
          requests: requests.filter(r => r.announcementId === announcement.id)
        })).filter(group => group.requests.length > 0);
      });
    });
  }

  loadSenderRequests(): void {
    this.requestService.getSenderRequests().subscribe(requests => {
      this.announcementService.getAnnouncements().subscribe(announcements => {
        this.groupedRequests = announcements.map(announcement => ({
          announcement,
          requests: requests.filter(r => r.announcementId === announcement.id)
        })).filter(group => group.requests.length > 0);
      });
    });
  }

  editRequest(request: any): void {
    const dialogRef = this.dialog.open(RequestFormComponent, {
      width: '500px',
      data: { request, announcementId: request.announcementId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAllRequests();
    });
  }

  updateStatus(requestId: number, status: string): void {
    this.requestService.updateRequestStatus(requestId, status).subscribe({
      next: () => {
        this.snackBar.open('Status updated', 'Close', { duration: 3000 });
        this.loadAllRequests();
      },
      error: () => this.snackBar.open('Update failed', 'Close', { duration: 3000 })
    });
  }

  deleteRequest(id: number): void {
    if (confirm('Delete this request?')) {
      this.requestService.deleteRequest(id).subscribe({
        next: () => {
          this.snackBar.open('Request deleted', 'Close', { duration: 3000 });
          this.loadAllRequests();
        },
        error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 })
      });
    }
  }
}
