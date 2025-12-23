import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// -- Interfaces based on API.md --

export interface JobSubmissionResponse {
  status_code: number;
  message: string;
  data: {
    job_id: string;
    status: string;
  };
}

export interface Job {
  id: string;
  user_id: number;
  jobdesc_path: string;
  cv_path: string;
  decision: string;
  report_path: string;
  progress: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetJobsResponse {
  status_code: number;
  message: string;
  data: Job[];
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly API_URL = 'http://localhost:8000/api/v1';
  private http = inject(HttpClient);

  /**
   * Submit a new job (CV + JD) for analysis
   * @param cvFile The Resume/CV file
   * @param jdFile The Job Description file
   * @param userId The ID of the user submitting the job
   */
  submitJob(cvFile: File, jdFile: File, userId: number | string): Observable<JobSubmissionResponse> {
    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('jobdesc', jdFile);
    // userId might need to be parsed to string or number depending on backend, keeping as appended field 
    formData.append('user_id', userId.toString());

    return this.http.post<JobSubmissionResponse>(`${this.API_URL}/jobs`, formData);
  }

  /**
   * Get all jobs (potentially filtered by user in the future if API supported query params, 
   * but docs say specific endpoint for user)
   */
  getJobs(): Observable<GetJobsResponse> {
    return this.http.get<GetJobsResponse>(`${this.API_URL}/jobs`);
  }

  /**
   * Get jobs for a specific user
   * @param userId ID of the user
   */
  getUserJobs(userId: number | string): Observable<GetJobsResponse> {
    return this.http.get<GetJobsResponse>(`${this.API_URL}/jobs/user/${userId}`);
  }

  /**
   * Download a file using the path provided in the job object
   * @param filePath The absolute path or relative path key from the job response
   */
  downloadFile(filePath: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/jobs/files`, {
      params: { path: filePath },
      responseType: 'blob'
    });
  }
}
