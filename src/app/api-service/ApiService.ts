// Import the HttpClient module
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Application } from '../views/Application';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Define the base URL of your backend API
  private baseUrl = 'http://localhost:7241/api';

  constructor(private http: HttpClient) { }

  // Method to fetch applications from the backend
  getApplications(uid: number) {
    return this.http.get<Application[]>(`${this.baseUrl}/Application?uid=${uid}`);
  }

  // Method to add a new application
  addApplication(application: any) {
    return this.http.post(`${this.baseUrl}/Application`, application);
  }

  // Method to update an application
  updateApplication(applicationId: number, application: any) {
    return this.http.put(`${this.baseUrl}/Application/${applicationId}`, application);
  }

  // Method to delete an application
  deleteApplication(applicationId: number) {
    return this.http.delete(`${this.baseUrl}/Application/${applicationId}`);
  }
}
