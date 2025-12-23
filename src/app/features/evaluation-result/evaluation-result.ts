/* 
  EVALUATION RESULT COMPONENT
  Displays the analysis results in a table format.
*/

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, Job } from '../../core/services/job.service';
import { ClerkService } from 'ngx-clerk';

@Component({
  selector: 'app-evaluation-result',
  imports: [CommonModule],
  templateUrl: './evaluation-result.html',
})
export class EvaluationResult implements OnInit {
  private jobService = inject(JobService);
  private clerk = inject(ClerkService);

  // Signal to hold our list of evaluation results
  // Signals are reactive primitives in Angular - when this data changes, the UI updates automatically
  protected readonly evaluationData = signal<Job[]>([]);

  ngOnInit() {
    this.clerk.user$.subscribe(user => {
      if (user?.id) {
        this.loadUserJobs(user.id);
      }
    });
  }

  loadUserJobs(userId: string) {
    this.jobService.getUserJobs(userId).subscribe({
      next: (response) => {
        if (response.data) {
          this.evaluationData.set(response.data);
        }
      },
      error: (err) => console.error('Failed to load jobs', err)
    });
  }

  // Method to handle download
  downloadFile(filePath: string) {
    this.jobService.downloadFile(filePath).subscribe({
        next: (blob) => {
            // Create a link element, hide it, click it, and then remove it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // Extract filename from path or use generic
            a.download = filePath.split('/').pop() || 'download';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },
        error: (err) => console.error('Download failed', err)
    });
  }

  // Method to view details (placeholder for now)
  viewDetails(id: string) {
    console.log(`Viewing details for: ${id}`);
    // Future: Navigate to a detailed report page or open a modal
  }
}
