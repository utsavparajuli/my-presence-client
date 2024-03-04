import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
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

  isLoading: boolean = true;
  isPopupOpen: boolean = false;
  applications: Application[] = [];

  displayedColumns: string[] = [
    'date',
    'company_name',
    'status',
    'url'];

  tableDataSource: MatTableDataSource<Application> = new MatTableDataSource();

  newApplicationData: Application = {
    // Define properties for application data
    id: 0,
    user_id: 1,
    company_name: '',
    status: '',
    date: new Date(), // Assuming you want to set the current date
    url: '',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('popupForm') popupFormTemplate: TemplateRef<any>;

  pageSizes = [5, 10, 25];

  constructor(private apiService: ApiService, private http: HttpClient, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadApplications();
  }

  //ngAfterViewInit() {
  //  this.tableDataSource.paginator = this.paginator;
  ////  this.tableDataSource.sort = this.sort;
  //}

  public loadApplications() {
    this.apiService.getApplications(1).subscribe(
      (result) => {
        this.applications = result;
        this.tableDataSource = new MatTableDataSource(result);
        this.tableDataSource.paginator = this.paginator;

        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }



  openPopupForm(): void {
    // Open the popup form
    this.isPopupOpen = true;

    // Open the MatDialog popup
    const dialogRef = this.dialog.open(this.popupFormTemplate, {
      height: '400px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(() => {
      // Reset the form fields and close the popup form
      this.newApplicationData = {
        // Define properties for application data
        id: 0,
        user_id: 1,
        company_name: '',
        status: '',
        date: new Date(), // Assuming you want to set the current date
        url: '',
      };
      this.isPopupOpen = false;
    });
  }

  submitApplication(): void {
    // Logic to submit the application
    console.log("POPup opened");
    console.log(this.newApplicationData);
    // Once submitted, close the popup form
    this.addApplication(this.newApplicationData);
    this.dialog.closeAll();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.tableDataSource.filter = filterValue;
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
