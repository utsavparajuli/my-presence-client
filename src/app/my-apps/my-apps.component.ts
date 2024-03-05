import { Component, OnInit, ViewChild, TemplateRef, ElementRef, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api-service/ApiService';
import { Application } from '../views/Application';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrl: './my-apps.component.css'
})
export class MyAppsComponent implements OnInit {

  isLoading:        boolean = true;
  isPopupOpen:      boolean = false;
  isPopupEditOpen:  boolean = false;
  isEdit:           boolean = false;
  isAdd:            boolean = true;

  newApplicationData: Application = {
    // Define properties for application data used for new apps and editing apps
    id: 0,
    user_id: 1,
    company_name: '',
    status: '',
    date: '',
    url: '',
    update: ''
  };

  pageSizes = [5, 10, 25];
  displayedColumns: string[] = ['date', 'company_name', 'url', 'status', 'update'];
  columnDisplayNames: { [key: string]: string } = {
    'date':         'Date',
    'company_name': 'Company',
    'url':          'URL',
    'status':       'Status',
    'update':       'Update'
  };

  tableDataSource: MatTableDataSource<Application> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('popupForm') popupFormTemplate: TemplateRef<any>;
  @ViewChild('tableContainer') tableContainer: ElementRef;

  constructor(
    private apiService: ApiService, private http: HttpClient,
    public dialog: MatDialog, private elementRef: ElementRef,
    private datePipe: DatePipe) {
  }

  //loads the applications which is an api call
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
      this.isEdit = false;
      this.isAdd = true;
      this.newApplicationData = {
        id: 0,
        user_id: 1,
        company_name: '',
        status: '',
        date: '',
        url: '',
        update: ''
      };
    }
  }

  //loadig applications
  public loadApplications() {
    this.apiService.getApplications(1).subscribe(
      (result) => {
        result.forEach(app => {
          // Format the date for each application
          app.date = this.datePipe.transform(app.date, 'yyyy-MM-dd');
        });
          this.tableDataSource = new MatTableDataSource(result);
          this.tableDataSource.paginator = this.paginator;
          this.tableDataSource.sort = this.sort;
          this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //function that executes when edit is pressed
  toggleEdit(app: Application) {
    this.newApplicationData = app;
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
        id: 0,
        user_id: 1,
        company_name: '',
        status: '',
        date: '',
        url: '',
        update: ''
      };
      this.isPopupOpen = false;
      this.isEdit = false;
      this.isAdd = true;
    });
  }

  // Logic to submit the application
  // Once submitted, close the popup form
  submitApplication(): void {
    if (this.isEdit) {
      this.updateApplication(this.newApplicationData.id, this.newApplicationData);
    } else {
      this.addApplication(this.newApplicationData);
    }
    this.dialog.closeAll();
  }

  //On deletion click call the api service
  deleteClick(): void {
    this.deleteApplication(this.newApplicationData.id);
    this.isEdit = false;
    this.isAdd = true;
  }

  //Filter for the table
  applyFilter(event: Event) {
    let filterValue: string = (event.target as HTMLInputElement).value;
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

  //Helper for color coding the rows
  getRowStyle(app: any): any {
    if (app.status === 'Rejected') {
      return { 'background-color': '#FFB5B6' };
    } else if (app.status === 'Interview') {
      return { 'background-color': '#A8D6AD' };
    } else if (app.status === 'Ghosted') {
      return { 'background-color': '#CEB5EB' };
    } else {
      return {};
    }
  }
}
