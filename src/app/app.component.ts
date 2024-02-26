import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  public onHomePage: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Subscribe to router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current URL corresponds to the homepage
        this.onHomePage = this.router.url === '/';
      }
    });
  }

  title = 'mypresence.client';
}
