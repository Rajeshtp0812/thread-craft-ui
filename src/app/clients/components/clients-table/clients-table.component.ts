import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MODAL_TYPE } from '../../../common/constants';
import { ContextMenu } from 'primeng/contextmenu';
import { ClientService } from '../../client.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.scss']
})
export class ClientsTableComponent {
  isDataLoading = false;
  cols = [
    { field: 'companyName', header: 'Company' },
    { field: 'email', header: 'Email' },
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
  @ViewChild('cm') contextMenu: ContextMenu


  constructor(public clientService: ClientService,
    private readonly messageService: MessageService) { }

  async ngOnInit() {
    this.fetchData();
    this.clientService.refetchData.subscribe(value => this.fetchData());
  }

  async fetchData() {
    this.isDataLoading = true;
    try {
      let response: any = await this.clientService.getClients();
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
          command: (data) => this.deleteClient(data)

        },
      ];
    }
    this.contextMenu.show(event);
  }

  async deleteClient(data) {
    try {
      await this.clientService.deleteClient(data.item.data.clientId);
      this.clientService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
