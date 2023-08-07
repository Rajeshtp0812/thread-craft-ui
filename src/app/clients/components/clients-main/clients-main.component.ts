import { Component, OnInit, ViewChild } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';
import { MENUS } from '../../../common/constants';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-clients-main',
  templateUrl: './clients-main.component.html',
  styleUrls: ['./clients-main.component.scss']
})
export class ClientsMainComponent implements OnInit {
  isDataLoading = false;
  cols = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Product' },
    { field: 'price', header: 'Price' },
    { field: 'category', header: 'Category' },
    { field: 'rating', header: 'Reviews' },
    { field: 'inventoryStatus', header: 'Status' }];
  data = [];
  contextMenus: any[];
  frozen = true;

  constructor() { }

  ngOnInit(): void {
    this.isDataLoading = true;
    setTimeout(() => {
      this.data = [
        {
          "id": "1000",
          "code": "f230fh0g3",
          "name": "Bamboo Watch",
          "description": "Product Description",
          "image": "bamboo-watch.jpg",
          "price": 65,
          "category": "Accessories",
          "quantity": 24,
          "inventoryStatus": "INSTOCK",
          "rating": 5
        },
        {
          "id": "1001",
          "code": "nvklal433",
          "name": "Black Watch",
          "description": "Product Description",
          "image": "black-watch.jpg",
          "price": 72,
          "category": "Accessories",
          "quantity": 61,
          "inventoryStatus": "OUTOFSTOCK",
          "rating": 4
        },];
      this.isDataLoading = false
    }, 2000)
  }

  onContextMenu(event: String, data = null) {
    if (event === 'tableMenu') {
      this.contextMenus = [
        {
          label: MENUS.ADD,
          data: data,
          command: () => this.addClient()
        },
      ];
    } else if (event === 'rowMenu') {
      this.contextMenus = [
        {
          label: MENUS.EDIT,
          data: data,
          command: (data) => this.editClient(data)

        },
        {
          label: MENUS.DELETE,
          data: data,
          command: (data) => this.deleteClient(data)

        },
      ];
    }
  }

  addClient() {
    console.log('add')
  }

  editClient(data) {
    console.log('edit')
  }

  deleteClient(data) {
    console.log('delete')
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
