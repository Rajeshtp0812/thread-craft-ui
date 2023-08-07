import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsMainComponent } from './components/clients-main/clients-main.component';

const routes: Routes = [{
  path: '', component: ClientsMainComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
