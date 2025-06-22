import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../../services/request.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule
  ],
})
export class RequestFormComponent implements OnInit {
  requestForm: FormGroup;
  isEditMode = false;
  statusOptions = ['WAITING', 'ACCEPTED', 'REJECTED'];

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      announcementId: number,
      request?: any
    }
  ) {
    this.requestForm = this.fb.group({
      dimensions: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0.1)]],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.request) {
      this.isEditMode = true;
      this.requestForm.patchValue(this.data.request);
    }
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const formData = {
        ...this.requestForm.value,
        announcementId: this.data.announcementId
      };

      const operation = this.isEditMode
        ? this.requestService.updateRequest(this.data.request.id, formData)
        : this.requestService.createRequest(formData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(`Request ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open(`Error ${this.isEditMode ? 'updating' : 'creating'} request`, 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}
