import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AnnouncementService } from '../../services/announcement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-announcement-form',
  templateUrl: './announcement-form.component.html',
  styleUrls: ['./announcement-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule
  ]
})
export class AnnouncementFormComponent implements OnInit {
  announcementForm: FormGroup;
  isEditMode = false;
  // statusOptions = ['AVAILABLE', 'CANCELED', 'COMPLETE'];

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AnnouncementFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { announcement: any }
  ) {
    this.announcementForm = this.fb.group({
      departure: ['', Validators.required],
      final_destination: ['', Validators.required],
      stages: [[]],
      maximum_dimensions: [''],
      goodsType: [''],
      capacity: [''],
      date: ['', Validators.required],
      status: ['AVAILABLE', Validators.required],
      driverName: ['']
    });
  }

  ngOnInit(): void {
    if (this.data?.announcement) {
      this.isEditMode = true;
      this.announcementForm.patchValue(this.data.announcement);
    }
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      const formValue = this.announcementForm.value;

      if (this.isEditMode) {
        this.announcementService.updateAnnouncement(
          this.data.announcement.id,
          formValue
        ).subscribe({
          next: () => {
            this.snackBar.open('Announcement updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => this.snackBar.open('Error updating announcement', 'Close', { duration: 3000 })
        });
      } else {
        this.announcementService.createAnnouncement(formValue).subscribe({
          next: () => {
            this.snackBar.open('Announcement created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => this.snackBar.open('Error creating announcement', 'Close', { duration: 3000 })
        });
      }
    }
  }

  addStage(event: any): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const stages = this.announcementForm.get('stages')?.value || [];
      stages.push(value.trim());
      this.announcementForm.get('stages')?.setValue(stages);
    }

    if (input) {
      input.value = '';
    }
  }

  removeStage(stage: string): void {
    const stages = this.announcementForm.get('stages')?.value || [];
    const index = stages.indexOf(stage);

    if (index >= 0) {
      stages.splice(index, 1);
      this.announcementForm.get('stages')?.setValue(stages);
    }
  }
}
