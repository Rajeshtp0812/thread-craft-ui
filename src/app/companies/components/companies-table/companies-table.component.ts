import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MENUS, MODAL_TYPE } from '../../../common/constants';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
  styleUrls: ['./companies-table.component.scss']
})
export class CompaniesTableComponent {
  isDataLoading = false;
  cols = [
    { field: 'companyName', header: 'Company' },
    { field: 'email', header: 'Email' },
    { field: 'contact', header: 'Contact' },
    { field: 'state', header: 'State' },
    { field: 'city', header: 'City' },
    { field: 'address', header: 'Address' },
    { field: 'gst', header: 'GST' },
  ];
  data = [{
    companyName: 'Saba Fashion',
    email: 'sabafashion@gmail.com',
    contact: 9874563210,
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Gala No 12, Kidwai Nagar Wadala (East)',
    gst: ''
  }];
  contextMenus: any[];
  frozen = true;
  @Output() openCompaniesForm = new EventEmitter();
  filterFields = [];

  @ViewChild('cm') contextMenu: ContextMenu

  constructor() { }

  ngOnInit(): void {
    this.filterFields = this.cols.map(col => col.field);
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
          command: (data) => this.deleteCompany(data)

        },
      ];
    }
    this.contextMenu.show(event);
  }

  deleteCompany(data) {
    console.log('delete')
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
