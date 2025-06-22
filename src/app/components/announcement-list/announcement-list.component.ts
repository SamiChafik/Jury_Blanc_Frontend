import { Component, OnInit } from '@angular/core';
import { AnnouncementService, Announcement } from '../../services/announcement.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementFormComponent } from '../announcement-form/announcement-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { RequestFormComponent } from '../request-form/request-form.component';

type AnnouncementStatus = 'AVAILABLE' | 'CANCELED' | 'COMPLETE';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule
  ]
})
export class AnnouncementListComponent implements OnInit {
  announcements: Announcement[] = [];
  statusOptions: AnnouncementStatus[] = ['AVAILABLE', 'CANCELED', 'COMPLETE'];

  displayedColumns: string[] = [
    'departure',
    'final_destination',
    'date',
    'status',
    'driverName',
    'actions'
  ];

  constructor(
    private announcementService: AnnouncementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe({
      next: (announcements) => this.announcements = announcements,
      error: (err) => this.showError('Failed to load announcements')
    });
  }

  getStatusClass(status: string): string {
  switch(status) {
    case 'AVAILABLE':
      return 'success';
    case 'CANCELED':
      return 'danger';
    case 'COMPLETE':
      return 'primary';
    default:
      return 'secondary';
  }
}

  openCreateDialog(): void {
      const dialogRef = this.dialog.open(AnnouncementFormComponent, {
        width: '800px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadAnnouncements();
      });
    }

  editAnnouncement(announcement: Announcement): void {
    const dialogRef = this.dialog.open(AnnouncementFormComponent, {
      width: '800px',
      data: { announcement: announcement }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAnnouncements();
    });
  }

  deleteAnnouncement(id: number): void {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcementService.deleteAnnouncement(id).subscribe({
        next: () => {
          this.loadAnnouncements();
          this.snackBar.open('Announcement deleted', 'Close', { duration: 3000 });
        },
        error: () => this.showError('Failed to delete announcement')
      });
    }
  }

  openRequestDialog(announcementId: number): void {
    const dialogRef = this.dialog.open(RequestFormComponent, {
      width: '500px',
      data: { announcementId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAnnouncements();
    });
  }

  updateStatus(id: number, newStatus: Announcement['status']): void {
    this.announcementService.updateAnnouncementStatus(id, { status: newStatus }).subscribe({
      next: () => {
        this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
        this.loadAnnouncements();
      },
      error: () => this.showError('Failed to update status')
    });
  }

  private isValidStatus(status: string): status is AnnouncementStatus {
    return this.statusOptions.includes(status as AnnouncementStatus);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
