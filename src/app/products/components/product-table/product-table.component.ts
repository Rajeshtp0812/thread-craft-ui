import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { Table } from 'primeng/table';
import { MODAL_TYPE } from '../../../common/constants';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent {
  isDataLoading = false;
  cols = [
    { field: 'details', header: 'Details' },
    { field: 'code', header: 'Code' },
    { field: 'image', header: 'Image' },
    { field: 'date', header: 'Date' },
    { field: 'size', header: 'Size' },
    { field: 'runNo', header: 'Run No' },
    { field: 'billNo', header: 'Bill No' },
    { field: 'average', header: 'Average' },
    { field: 'embroidary', header: 'Embroidary' },
    { field: 'fittingStich', header: 'Fitting Stich' },
    { field: 'buttonStich', header: 'Button Stich' },
    { field: 'print', header: 'Print' },
    { field: 'pintex', header: 'Pintex' },
    { field: 'kMaking', header: 'K-Making' },
    { field: 'tag', header: 'Tag' },
    { field: 'label', header: 'Label' },
    { field: 'making', header: 'Making' },
    { field: 'canvas', header: 'Canvas' },
    { field: 'totalAmount', header: 'Total Amount' }
  ];
  data = [];
  contextMenus: any[];
  @Output() openProductForm = new EventEmitter();
  filterFields = this.cols.map(col => col.field);
  @ViewChild('dt') dt: Table;

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
      let response: any = await this.productService.getProducts();
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
          command: () => this.openProductForm.emit({ modalType: MODAL_TYPE.ADD, data: null })
        },
      ];
    } else if (type === 'rowMenu') {
      this.contextMenus = [
        {
          label: 'Edit',
          data: data,
          command: (data) => this.openProductForm.emit({ modalType: MODAL_TYPE.EDIT, data })

        },
        {
          label: 'Delete',
          data: data,
          command: (data) => this.deleteProduct(data)

        },
      ];
    }
    this.contextMenu.show(event);
  }

  async deleteProduct(data) {
    try {
      await this.productService.deleteProduct(data.item.data.productId);
      this.productService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
