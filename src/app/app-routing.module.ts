import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAppsComponent } from './my-apps/my-apps.component';

const routes: Routes = [
  { path: 'my-app', component: MyAppsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
