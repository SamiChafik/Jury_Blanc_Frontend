import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Announcement {
  id: number;
  departure: string;
  final_destination: string;
  stages: string[];
  maximum_dimensions: string;
  goodsType: string;
  capacity: string;
  date: string;
  status: 'AVAILABLE' | 'CANCELED' | 'COMPLETE';
  driverName: string;
}

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private apiUrl = 'http://localhost:8080/announcements';

  constructor(private http: HttpClient) {}

  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  createAnnouncement(announcement: Omit<Announcement, 'id'>): Observable<Announcement> {
    return this.http.post<Announcement>(this.apiUrl, announcement);
  }

  updateAnnouncement(id: number, announcement: Partial<Announcement>): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/${id}`, announcement);
  }

  updateAnnouncementStatus(id: number, announcement: Partial<Announcement>): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/updateStatus/${id}`, announcement);
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  demandAnnouncement(id: number): Observable<Announcement> {
    return this.http.patch<Announcement>(`${this.apiUrl}/${id}/demand`, {});
  }
}
