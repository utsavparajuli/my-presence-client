import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyAppsComponent } from './my-apps/my-apps.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { ForYouComponent } from './for-you/for-you.component';

//contains the declarations related to the modules
@NgModule({
  declarations: [
    AppComponent,
    MyAppsComponent,
    NavBarComponent,
    HomeComponent,
    NotesComponent,
    ForYouComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
