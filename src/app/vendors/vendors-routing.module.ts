import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorMainComponent } from './vendor-main/vendor-main.component';

const routes: Routes = [{
  path: '', component: VendorMainComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
