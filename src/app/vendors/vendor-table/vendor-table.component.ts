import { Component, EventEmitter, Output, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { MODAL_TYPE } from '../../common/constants';
import { ContextMenu } from 'primeng/contextmenu';
import { VendorService } from '../vendor.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-table',
  templateUrl: './vendor-table.component.html',
  styleUrls: ['./vendor-table.component.scss']
})
export class VendorTableComponent implements OnInit, OnDestroy {
  isDataLoading = false;
  cols = [
    { field: 'ownerName', header: 'Owner' },
    { field: 'companyName', header: 'Company' },
    { field: 'contact', header: 'Contact' },
    { field: 'state', header: 'State' },
    { field: 'city', header: 'City' },
    { field: 'address', header: 'Address' },
    { field: 'pinCode', header: 'Pin Code' },
    { field: 'gst', header: 'GST' }];
  data = [];
  contextMenus: any[];
  @Output() openCompaniesForm = new EventEmitter();
  filterFields = this.cols.map(col => col.field);
  @ViewChild('cm') contextMenu: ContextMenu;
  refetchDataSubscrption: Subscription;

  constructor(private readonly vendorService: VendorService,
    private readonly messageService: MessageService) { }

  ngOnInit(): void {
    this.fetchData();
    this.refetchDataSubscrption = this.vendorService.refetchData.subscribe(value => this.fetchData());
  }

  async fetchData() {
    this.isDataLoading = true;
    try {
      let response: any = await this.vendorService.getVendors();
      this.data = response.data;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    } finally {
      this.isDataLoading = false;
    }
  }

  onContextMenu(event: MouseEvent, type: String, data = null) {
    event.preventDefault();
    if (type === 'tableMenu') {
      this.contextMenus = [
        {
          label: 'Add',
          data: data,
          command: () => this.openCompaniesForm.emit({ modalType: MODAL_TYPE.ADD, data: null })
        },
      ];
    } else if (type === 'rowMenu') {
      this.contextMenus = [
        {
          label: 'Edit',
          data: data,
          command: (data) => this.openCompaniesForm.emit({ modalType: MODAL_TYPE.EDIT, data })

        },
        {
          label: 'Delete',
          data: data,
          command: (data) => this.deleteVendor(data)

        },
      ];
    }
    this.contextMenu.show(event);
  }

  async deleteVendor(data) {
    try {
      await this.vendorService.deleteVendor(data.item.data.vendorId);
      this.vendorService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    if (this.refetchDataSubscrption) {
      this.refetchDataSubscrption.unsubscribe();
    }
  }

}
