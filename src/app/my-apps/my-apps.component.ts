import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../api-service/ApiService';
import { Application } from '../views/Application';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrl: './my-apps.component.css'
})
export class MyAppsComponent implements OnInit {

  isLoading: boolean = true;
  isPopupOpen: boolean = false;
  isPopupEditOpen: boolean = false;
  isEdit: boolean = false;
  isAdd: boolean = true;

  editingApp: Application;

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
    date: '', // Assuming you want to set the current date
    url: '',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('popupForm') popupFormTemplate: TemplateRef<any>;
  @ViewChild('tableContainer') tableContainer: ElementRef;

  pageSizes = [5, 10, 25];

  constructor(
    private apiService: ApiService, private http: HttpClient,
    public dialog: MatDialog, private elementRef: ElementRef,
    private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.loadApplications();
  }

  // Function to handle click events outside of the table rows
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    // Check if the clicked element is the button or inside the button
    const isButtonClicked = clickedElement.closest('.edit-box');
    const isInsideEditPopup = clickedElement.closest('.edit-popup');
    const isInsideAddPopup = clickedElement.closest('.add-popup');


    if (!this.elementRef.nativeElement.contains(clickedElement) && !isButtonClicked && !isInsideEditPopup && !isInsideAddPopup) {
      this.editingApp = null; // Reset the selected row
      this.isEdit = false;
      this.isAdd = true;
      this.newApplicationData = {
        // Define properties for application data
        id: 0,
        user_id: 1,
        company_name: '',
        status: '',
        date: '', // Assuming you want to set the current date
        url: '',
      };
    }
  }

  //ngAfterViewInit() {
  //  this.tableDataSource.paginator = this.paginator;
  ////  this.tableDataSource.sort = this.sort;
  //}

  public loadApplications() {
    this.apiService.getApplications(1).subscribe(
      (result) => {
        this.applications = result;
        result.forEach(app => {
          // Format the date for each application
          app.date = this.datePipe.transform(app.date, 'yyyy-MM-dd');
        });
          this.tableDataSource = new MatTableDataSource(result);
          this.tableDataSource.paginator = this.paginator;

          this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }


  toggleEdit(app: Application) {
    this.newApplicationData = app;
    console.log(app);
    this.isEdit = true;
    this.isAdd = false;
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
        date: '', // Assuming you want to set the current date
        url: '',
      };
      this.isPopupOpen = false;
      this.isEdit = false;
      this.isAdd = true;
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

  deleteClick(): void {
    this.deleteApplication(this.newApplicationData.id);
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
