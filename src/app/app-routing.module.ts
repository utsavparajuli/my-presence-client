import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyAppsComponent } from './my-apps/my-apps.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'my-apps', component: MyAppsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
