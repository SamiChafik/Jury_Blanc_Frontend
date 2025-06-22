import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../../services/request.service';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
})
export class RequestFormComponent {
  requestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { announcementId: number }
  ) {
    this.requestForm = this.fb.group({
      dimensions: ['', Validators.required],
      weight: ['', Validators.required],
      type: ['', Validators.required],
      status:['WAITING']
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.requestService
        .createRequest({
          ...this.requestForm.value,
          announcementId: this.data.announcementId,
        })
        .subscribe({
          next: () => {
            this.snackBar.open('Transport request submitted!', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(true);
          },
          error: () =>
            this.snackBar.open('Error submitting request', 'Close', {
              duration: 3000,
            }),
        });
    }
  }
}
