import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MODAL_TYPE } from '../../../common/constants';
import { MessageService } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { ProductService } from '../../../products/product.service';

@Component({
  selector: 'app-product-allotment-table',
  templateUrl: './product-allotment-table.component.html',
  styleUrls: ['./product-allotment-table.component.scss']
})
export class ProductAllotmentTableComponent {
  isDataLoading = false;
  cols = [
    { field: 'companyName', header: 'Vendor' },
    { field: 'deliveryDate', header: 'Date' },
    { field: 'size', header: 'Size' },
    { field: 'quantity', header: 'Quantity' },
    { field: 'vendorRate', header: 'Rate' },
    { field: 'totalAmount', header: 'Total Amount' },
    { field: 'balanceAmount', header: 'Balance Amount' },
    { field: 'advancePayment', header: 'Advance Payment' }];
  data = [];
  contextMenus: any[];
  @Output() openAllottmentForm = new EventEmitter();
  filterFields = [];

  @ViewChild('cm') contextMenu: ContextMenu


  constructor(public productService: ProductService,
    private readonly messageService: MessageService) { }

  async ngOnInit() {
    this.fetchData();
    this.productService.refetchData.subscribe(value => this.fetchData());
  }

  async fetchData() {
    this.isDataLoading = true;
    try {
      let response: any = await this.productService.getAllottedProducts();
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
          command: () => this.openAllottmentForm.emit({ modalType: MODAL_TYPE.ADD, data: null })
        },
      ];
    } else if (type === 'rowMenu') {
      this.contextMenus = [
        {
          label: 'Edit',
          data: data,
          command: (data) => this.openAllottmentForm.emit({ modalType: MODAL_TYPE.EDIT, data })

        },
        {
          label: 'Delete',
          data: data,
          command: (data) => this.deleteClient(data)

        },
      ];
    }
    this.contextMenu.show(event);
  }

  async deleteClient(data) {
    try {
      await this.productService.deleteAllotment(data.item.data.productAllotmentId);
      this.productService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
