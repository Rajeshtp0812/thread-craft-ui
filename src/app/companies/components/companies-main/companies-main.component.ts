import { Component, EventEmitter, Output } from '@angular/core';
import { MODAL_TYPE } from '../../../common/constants';

@Component({
  selector: 'app-companies-main',
  templateUrl: './companies-main.component.html',
  styleUrls: ['./companies-main.component.scss']
})
export class CompaniesMainComponent {
  isCompanyFormOpen = false;
  editProductDetails: any = null;
  selectedModal: MODAL_TYPE;

  openCompaniesForm(event) {
    this.isCompanyFormOpen = !this.isCompanyFormOpen;
    this.editProductDetails = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editProductDetails = event.data;
    }
  }

  cancel() {
    this.isCompanyFormOpen = false;
  }
}
