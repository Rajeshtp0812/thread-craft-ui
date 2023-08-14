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
    this.formDataEmitter.emit({ data: { ownerName: this.ownerName, ...data.data }, status: data.status });
  }
}
