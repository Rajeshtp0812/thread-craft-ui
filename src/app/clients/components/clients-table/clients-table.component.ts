import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MODAL_TYPE } from '../../../common/constants';
import { ContextMenu } from 'primeng/contextmenu';
import { ClientService } from '../../client.service';

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.scss']
})
export class ClientsTableComponent {
  isDataLoading = false;
  cols = [
    { field: 'name', header: 'Company Name' },
    { field: 'email', header: 'Email' },
    { field: 'state', header: 'State' },
    { field: 'city', header: 'City' },
    { field: 'pinCode', header: 'Pin Code' },
    { field: 'address', header: 'Address' }];
  data = [{
    "name": "1000",
    "email": "f230fh0g3",
    "state": "Product Description",
    "city": "bamboo-watch.jpg",
    "pinCode": 65,
    "address": "Accessories",
    "companyId": 24
  }];
  contextMenus: any[];
  @Output() openCompaniesForm = new EventEmitter();
  filterFields = [];

  @ViewChild('cm') contextMenu: ContextMenu


  constructor(public clientService: ClientService) { }

  async ngOnInit() {
    try {
      let clientData = await this.clientService.getClients();
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

  deleteClient(data) {
    console.log('delete')
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
