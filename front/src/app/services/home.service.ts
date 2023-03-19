import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface FileUploadResponse {
  success: boolean;
  message: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  uploadPhoto(photo: File): Observable<FileUploadResponse> {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(photo.type)) {
      return throwError(() => 'File type not supported. Please upload a JPEG or PNG image.');
    }

    if (photo.size > 5 * 1024 * 1024) {
      return throwError(() => 'File size is too large. Please upload a file smaller than 5MB.');
    }

    const formData = new FormData();
    formData.append('photo', photo, photo.name);

    return this.http.post<FileUploadResponse>(`${this.baseUrl}upload/`, formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
          // Return an observable with a user-facing error message.
          return throwError(
            () => 'Something bad happened; please try again later.');
        })
      );
  }
  handleImageSelection(event: Event): Promise<string> {
    return new Promise((resolve, reject) => {
      const inputElement = event.target as HTMLInputElement;
      const file = inputElement.files ? inputElement.files[0] : undefined;
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(reader.error);
        };
        reader.readAsDataURL(file);
      } else {
        reject(new Error('No file selected'));
      }
    });
  }
}
