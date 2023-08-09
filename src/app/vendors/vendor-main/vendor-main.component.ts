import { Component } from '@angular/core';
import { MODAL_TYPE } from '../../common/constants';

@Component({
  selector: 'app-vendor-main',
  templateUrl: './vendor-main.component.html',
  styleUrls: ['./vendor-main.component.scss']
})
export class VendorMainComponent {
  isVendorFormOpen = false;
  editProductDetails: any = null;
  selectedModal: MODAL_TYPE;

  openCompaniesForm(event) {
    this.isVendorFormOpen = !this.isVendorFormOpen;
    this.editProductDetails = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editProductDetails = event.data;
    }
  }

  cancel() {
    this.isVendorFormOpen = false;
  }
}
