import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyAppsComponent } from './my-apps/my-apps.component';
import { ForYouComponent } from './for-you/for-you.component';
import { NotesComponent } from './notes/notes.component';

//Contains the routes to different components
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'my-apps', component: MyAppsComponent },
  { path: 'for-you', component: ForYouComponent },
  { path: 'notes', component: NotesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
