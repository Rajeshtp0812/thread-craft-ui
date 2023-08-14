import { Component } from '@angular/core';
import { MODAL_TYPE } from '../../common/constants';
import { VendorService } from '../vendor.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-vendor-main',
  templateUrl: './vendor-main.component.html',
  styleUrls: ['./vendor-main.component.scss']
})
export class VendorMainComponent {
  isVendorFormOpen = false;
  editVendorDetail: any = null;
  selectedModal: MODAL_TYPE;
  isFormValid = false;
  formData = null;

  constructor(private readonly vendorService: VendorService,
    private readonly messageService: MessageService) { }

  openCompaniesForm(event) {
    this.isVendorFormOpen = !this.isVendorFormOpen;
    this.editVendorDetail = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editVendorDetail = event.data.item.data;
    }
  }

  closeForm() {
    this.isVendorFormOpen = false;
  }

  async setFormData(formData: any) {
    this.isFormValid = formData.status;
    this.formData = formData.data;
  }

  async saveClient() {
    if (!this.isFormValid) {
      return;
    }
    try {
      if (this.selectedModal === MODAL_TYPE.ADD) {
        await this.vendorService.createVendor(this.formData);
        this.messageService.add({ severity: 'success', summary: 'Vendor created successfully', detail: '' });
      } else if (this.selectedModal === MODAL_TYPE.EDIT) {
        await this.vendorService.updateVendor(this.editVendorDetail.vendorId, this.formData);
        this.messageService.add({ severity: 'success', summary: 'Vendor updated succesfully', detail: '' });
      }
      this.closeForm();
      this.vendorService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }
}
