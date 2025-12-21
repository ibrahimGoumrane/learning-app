import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  imports: [CommonModule ],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload {
  // Signals to track drag state for each zone
  protected readonly isDraggingCv = signal(false);
  protected readonly isDraggingJd = signal(false);

  // Signals to store the selected files
  protected readonly cvFile = signal<File | null>(null);
  protected readonly jdFile = signal<File | null>(null);

  constructor(private router: Router) {}

  onDragOver(event: DragEvent, type: 'cv' | 'jd') {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'cv') this.isDraggingCv.set(true);
    else this.isDraggingJd.set(true);
  }

  onDragLeave(event: DragEvent, type: 'cv' | 'jd') {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'cv') this.isDraggingCv.set(false);
    else this.isDraggingJd.set(false);
  }

  onDrop(event: DragEvent, type: 'cv' | 'jd') {
    event.preventDefault();
    event.stopPropagation();
    
    if (type === 'cv') this.isDraggingCv.set(false);
    else this.isDraggingJd.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (type === 'cv') this.cvFile.set(files[0]);
      else this.jdFile.set(files[0]);
    }
  }

  onFileSelected(event: Event, type: 'cv' | 'jd') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (type === 'cv') this.cvFile.set(input.files[0]);
      else this.jdFile.set(input.files[0]);
    }
  }

  // Helper to clear a file
  clearFile(type: 'cv' | 'jd') {
    if (type === 'cv') this.cvFile.set(null);
    else this.jdFile.set(null);
  }

  analyze() {
    if (this.cvFile() && this.jdFile()) {
      // In a real app, we would upload both files here.
      // For now, we simulate success and navigate.
      this.router.navigate(['/results']);
    }
  }
}
