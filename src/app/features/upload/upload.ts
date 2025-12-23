import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClerkService } from 'ngx-clerk';
import { JobService } from '../../core/services/job.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload implements OnInit, OnDestroy {
  // Signals to track drag state for each zone
  protected readonly isDraggingCv = signal(false);
  protected readonly isDraggingJd = signal(false);

  // Signals to store the selected files
  protected readonly cvFile = signal<File | null>(null);
  protected readonly jdFile = signal<File | null>(null);

  // Analysis State
  protected readonly isAnalyzing = signal(false);
  protected readonly progress = signal(0);
  protected readonly statusMessage = signal('');
  
  private userId: string | null = null;
  private wsSubscription?: Subscription;

  constructor(
    private router: Router,
    private clerk: ClerkService,
    private jobService: JobService,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {
    // Get the current user ID
    this.clerk.user$.subscribe(user => {
      this.userId = user?.id || null;
    });
  }

  ngOnDestroy() {
    this.wsService.disconnect();
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  onDragOver(event: DragEvent, type: 'cv' | 'jd') {
    event.preventDefault();
    event.stopPropagation(); // Stop propagation to prevent browser handling
    if (this.isAnalyzing()) return; // Disable drag during analysis

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
    
    if (this.isAnalyzing()) return;

    if (type === 'cv') this.isDraggingCv.set(false);
    else this.isDraggingJd.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (type === 'cv') this.cvFile.set(files[0]);
      else this.jdFile.set(files[0]);
    }
  }

  onFileSelected(event: Event, type: 'cv' | 'jd') {
    if (this.isAnalyzing()) return;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (type === 'cv') this.cvFile.set(input.files[0]);
      else this.jdFile.set(input.files[0]);
    }
  }

  // Helper to clear a file
  clearFile(type: 'cv' | 'jd') {
    if (this.isAnalyzing()) return;

    if (type === 'cv') this.cvFile.set(null);
    else this.jdFile.set(null);
  }

  analyze() {
    const cv = this.cvFile();
    const jd = this.jdFile();

    if (cv && jd && this.userId) {
      this.isAnalyzing.set(true);
      this.statusMessage.set('Uploading files...');
      this.progress.set(0);

      // 1. Submit Job via HTTP
      this.jobService.submitJob(cv, jd, this.userId).subscribe({
        next: (response) => {
          const jobId = response.data.job_id;
          this.statusMessage.set('Connected to server, waiting for updates...');
          
          // 2. Connect to WebSocket for progress
          this.wsSubscription = this.wsService.connect(jobId).subscribe({
            next: (msg) => {
              if (msg.message) this.statusMessage.set(msg.message);
              if (msg.progress !== undefined) this.progress.set(msg.progress);

              if (msg.progress === 100) {
                // Wait a moment for the user to see 100%
                setTimeout(() => {
                  this.router.navigate(['/results']);
                }, 1000);
              }
            },
            error: (err) => {
              console.error('WebSocket Error:', err);
              this.statusMessage.set('Connection lost. Please try again.');
              this.isAnalyzing.set(false);
            }
          });
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.statusMessage.set('Upload failed. Please try again.');
          this.isAnalyzing.set(false);
        }
      });
    } else if (!this.userId) {
      alert('You must be logged in to analyze documents.');
    }
  }
}
