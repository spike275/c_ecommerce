import { Component } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

interface FileUploadResponse {
  success: boolean;
  message: string;
  url?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class PhotoUploadComponent {
  selectedFile: File | undefined;
  isUploading = false;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  
  constructor(private homeService: HomeService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload.';
      return;
    }

    this.homeService.uploadPhoto(this.selectedFile).subscribe({
      next: (response) => {
        this.isUploading = false;
        if (response.success) {
          this.successMessage = 'File uploaded successfully!';
          if (response.url) {
            console.log(`Uploaded file URL: ${response.url}`);
          }
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.errorMessage = error.message;
      }
    });
  }
}


