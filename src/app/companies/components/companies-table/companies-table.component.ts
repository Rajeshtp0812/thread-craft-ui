import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { COMPANY, MODAL_TYPE } from '../../../common/constants';
import { ContextMenu } from 'primeng/contextmenu';
import { CompaniesService } from '../../companies.service';
import { MessageService } from 'primeng/api';

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
  filterFields = this.cols.map(col => col.field);
  selectedCompany = null;

  @ViewChild('cm') contextMenu: ContextMenu

  constructor(private readonly companyService: CompaniesService,
    private readonly messageService: MessageService) {
    this.selectedCompany = JSON.parse(localStorage.getItem(COMPANY));
  }

  ngOnInit() {
    this.filterFields = this.cols.map(col => col.field);
    this.fetchData();
    this.companyService.refetchData.subscribe(value => this.fetchData());
  }

  async fetchData() {
    this.isDataLoading = true;
    try {
      let response: any = await this.companyService.getCompanies();
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

  async deleteCompany(data) {
    if (this.data.length === 1) {
      this.messageService.add({ severity: 'info', summary: 'Cannot delete. At least one company must remain', detail: '' });
      return;
    } else if (data.item.data.companyId === this.selectedCompany.companyId) {
      this.messageService.add({ severity: 'info', summary: 'Cannot delete. currently logged in company', detail: '' });
      return;
    }
    try {
      await this.companyService.deleteCompany(data.item.data.companyId);
      this.companyService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
