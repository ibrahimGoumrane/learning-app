/* 
  EVALUATION RESULT COMPONENT
  Displays the analysis results in a table format.
*/

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EvaluationReport {
  id: string;
  cvFileName: string;
  jdFileName: string;
  decision: string;
  overallScore: number;
}

@Component({
  selector: 'app-evaluation-result',
  imports: [CommonModule],
  templateUrl: './evaluation-result.html',
})
export class EvaluationResult {

  // Signal to hold our list of evaluation results
  // Signals are reactive primitives in Angular - when this data changes, the UI updates automatically
  protected readonly evaluationData = signal<EvaluationReport[]>([
    {
      id: 'EVAL-001',
      cvFileName: 'candidate_resume.pdf',
      jdFileName: 'senior_engineer_jd.pdf',
      decision: 'REVIEW',
      overallScore: 0.35
    }
  ]);

  // Method to handle "download" (placeholder)
  downloadFile(fileName: string) {
    console.log(`Downloading file: ${fileName}`);
    alert(`Downloading ${fileName}... (This is a placeholder)`);
  }

  // Method to view details (placeholder)
  viewDetails(id: string) {
    console.log(`Viewing details for: ${id}`);
    alert(`Opening details for ${id}... (This is a placeholder)`);
  }
}
