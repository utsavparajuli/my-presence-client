import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api-service/ApiService';
import { Application } from '../views/Application';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrl: './my-apps.component.css'
})
export class MyAppsComponent implements OnInit {
  applications: Application[] = [];
  displayedColumns = ['date', 'company_name', 'status', 'url'];
  tableDataSource: MatTableDataSource<Application>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService, private http: HttpClient) {
    this.tableDataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadApplications();
    this.tableDataSource = new MatTableDataSource(this.applications);
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  //ngAfterViewInit() {
  //  this.tableDataSource.paginator = this.paginator;
  //  this.tableDataSource.sort = this.sort;
  //}

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.tableDataSource.filter = filterValue;
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
