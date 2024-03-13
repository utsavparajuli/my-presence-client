import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PdfService } from '../api-service/PdfService';
import { Subscription, finalize } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router, private http: HttpClient, private pdfService: PdfService) { }

  @Input()
  requiredFileType = ".pdf";
   
  fileName = '';
  uploadProgress: number;
  uploadSub: Subscription;

  isHomePage(): boolean {
    return this.router.url === '/';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);

      const upload$ = this.http.post("/api/thumbnail-upload", formData, {
        reportProgress: true,
        observe: 'events'
      })
      .pipe(
          finalize(() => this.reset())
        );

      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      })
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }

}
