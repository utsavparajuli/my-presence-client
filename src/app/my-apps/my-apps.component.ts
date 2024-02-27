import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../api-service/ApiService';
import { Application } from '../views/Application';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrl: './my-apps.component.css'
})
export class MyAppsComponent implements OnInit {
  applications: Application[] = [];
  displayedColumns = ['date', 'company_name', 'status', 'url'];
  tableDataSource: MatTableDataSource<Application>;
  isLoading: boolean = true; // Set to true initially, indicating data is loading
  isPopupOpen: boolean = false;
  //popupFormTemplate: TemplateRef<any>; // Define TemplateRef variable

  newApplicationData = {
    // Define properties for application data
    date: Date.now,
    companyName: '',
    status: '',
    url: ''
    // Add more properties as needed
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('popupForm') popupFormTemplate: TemplateRef<any>;

  constructor(private apiService: ApiService, private http: HttpClient, public dialog: MatDialog) {
    this.tableDataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadApplications();
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
    this.tableDataSource = new MatTableDataSource(this.applications);
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  //ngAfterViewInit() {
  //  this.tableDataSource.paginator = this.paginator;
  //  this.tableDataSource.sort = this.sort;
  //}

  openPopupForm(): void {
    // Open the popup form
    this.isPopupOpen = true;

    // Open the MatDialog popup
    const dialogRef = this.dialog.open(this.popupFormTemplate);
    dialogRef.afterClosed().subscribe(() => {
      // Reset the form fields and close the popup form
      this.newApplicationData = {
        // Define properties for application data
        date: Date.now,
        companyName: '',
        status: '',
        url: ''
        // Add more properties as needed
      };
      this.isPopupOpen = false;
    });
  }

  submitApplication(): void {
    // Logic to submit the application
    console.log("POPup opened");
    console.log(this.newApplicationData);
    // Once submitted, close the popup form
    this.dialog.closeAll();
  }

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
