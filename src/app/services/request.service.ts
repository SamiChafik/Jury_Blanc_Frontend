import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private apiUrl = 'http://localhost:8080/requests';

  constructor(private http: HttpClient) {}

  createRequest(request: {
    dimensions: string;
    weight: string;
    type: string;
    status: string;
    announcementId: number
  }): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  getRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSenderRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/senderRequests`);
  }

  updateRequest(id: number, requestData: {
    dimensions?: string;
    weight?: string;
    type?: string;
    announcementId?: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, requestData);
  }

  updateRequestStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
