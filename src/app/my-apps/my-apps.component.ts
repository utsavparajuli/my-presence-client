import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service/ApiService';
import { Application } from '../views/Application';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrl: './my-apps.component.css'
})
export class MyAppsComponent {
  applications: Application[] = [];
  constructor(private apiService: ApiService, private http: HttpClient) { }

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.apiService.getApplications(1).subscribe(
      (result) => {
        this.applications = result;
      },
      (error) => {
        console.error(error);
      }
    );
    //this.http.get(`https://localhost:7241/Application?uid=1`).subscribe(
    //  (result) => {
    //    console.log("response got");
    //    this.applications = result;
    //  },
    //  (error) => {
    //    console.error(error);
    //  }
    //);

  }

  addApplication(application: any) {
    this.apiService.addApplication(application).subscribe(() => {
      this.loadApplications();
    });
  }

  updateApplication(applicationId: number, application: any) {
    this.apiService.updateApplication(applicationId, application).subscribe(() => {
      this.loadApplications();
    });
  }

  deleteApplication(applicationId: number) {
    this.apiService.deleteApplication(applicationId).subscribe(() => {
      this.loadApplications();
    });
  }
}
