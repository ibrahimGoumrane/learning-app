import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

export interface WebSocketMessage {
  type: 'CONNECTION_ESTABLISHED' | 'PROGRESS' | 'COMPLETED' | 'ERROR';
  job_id: string;
  message: string;
  progress?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private readonly WS_BASE_URL = 'ws://localhost:8000/ws/jobs';
  private socket$!: WebSocketSubject<WebSocketMessage>;

  /**
   * Connect to the WebSocket stream for a specific job
   * @param jobId The ID of the job to track
   */
  connect(jobId: string): Observable<WebSocketMessage> {
    const url = `${this.WS_BASE_URL}/${jobId}`;
    
    // Create a new WebSocket connection
    this.socket$ = webSocket<WebSocketMessage>(url);

    return this.socket$.asObservable();
  }

  /**
   * Close the active connection
   */
  disconnect() {
    if (this.socket$) {
      this.socket$.complete(); // Closes the connection
    }
  }
}
