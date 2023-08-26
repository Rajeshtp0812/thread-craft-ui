import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductAllotmentMainComponent } from './components/product-allotment-main/product-allotment-main.component';

const routes: Routes = [{
  path: '', component: ProductAllotmentMainComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductAllotmentRoutingModule { }
