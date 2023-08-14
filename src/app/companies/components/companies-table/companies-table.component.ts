import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MENUS, MODAL_TYPE } from '../../../common/constants';
import { ContextMenu } from 'primeng/contextmenu';
import { CompaniesService } from '../../companies.service';

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
  data = [];
  contextMenus: any[];
  frozen = true;
  @Output() openCompaniesForm = new EventEmitter();
  filterFields = [];

  @ViewChild('cm') contextMenu: ContextMenu

  constructor(private readonly companyService: CompaniesService) { }

  ngOnInit() {
    this.filterFields = this.cols.map(col => col.field);
    this.fetchData();
    this.companyService.refetchData.subscribe(value => this.fetchData());
  }

  async fetchData() {
    try {
      let response: any = await this.companyService.getCompanies();
      this.data = response.data;
    } catch (error) {

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
    } else if (type === 'rowMenu' || event.type === 'contextmenu') {
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
