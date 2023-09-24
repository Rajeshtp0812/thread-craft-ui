import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MODAL_TYPE } from '../../common/constants';

@Component({
  selector: 'app-vendor-config',
  templateUrl: './vendor-config.component.html',
  styleUrls: ['./vendor-config.component.scss']
})
export class VendorConfigComponent {
  vendorDetail = null;
  selectedModal: MODAL_TYPE;
  ownerName = '';
  isDialogOpen = false;
  formData = null;
  isFormValid = false;

  @Input() set isVendorFormOpen(value) {
    if (!value) {
      this.ownerName = '';
    }
    this.isDialogOpen = value;
  }

  @Input() set editVendorDetail(value) {
    if (value) {
      this.vendorDetail = value;
      this.ownerName = value.ownerName;
    }
  }

  @Output() formDataEmitter = new EventEmitter();

  setFormData(data: any) {
    this.isFormValid = data.status;
    this.formData = { data: { ...data.data } };
    this.sendFormData();
  }

  sendFormData(event?) {
    this.formData['data']['ownerName'] = this.ownerName;
    this.formData['status'] = this.isFormValid && !!this.ownerName;
    this.formDataEmitter.emit(this.formData);
  }
}
