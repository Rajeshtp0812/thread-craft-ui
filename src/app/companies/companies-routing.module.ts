import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesMainComponent } from './components/companies-main/companies-main.component';

const routes: Routes = [{
  path: "companies", component: CompaniesMainComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
