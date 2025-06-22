import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RequestService } from '../../services/request.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-announcement-requests',
  templateUrl: './announcement-requests.component.html',
  styleUrls: ['./announcement-requests.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule
  ]
})
export class AnnouncementRequestsComponent {
  requests: any[] = [];
  displayedColumns: string[] = ['dimensions', 'weight', 'type', 'status', 'actions'];
  statusOptions = ['ACCEPTED', 'REJECTED'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { announcementId: number },
    private requestService: RequestService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AnnouncementRequestsComponent>,
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService.getRequestsByAnnouncement(this.data.announcementId).subscribe({
      next: (requests) => this.requests = requests,
      error: () => this.snackBar.open('Failed to load requests', 'Close', { duration: 3000 })
    });
  }

  updateRequestStatus(requestId: number, status: string): void {
    this.requestService.updateRequestStatus(requestId, status).subscribe({
      next: () => {
        this.snackBar.open('Request updated', 'Close', { duration: 3000 });
        this.loadRequests();
      },
      error: () => this.snackBar.open('Failed to update request', 'Close', { duration: 3000 })
    });
  }
}
