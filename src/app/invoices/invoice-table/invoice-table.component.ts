import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { COMPANY, MODAL_TYPE } from '../../common/constants';
import { ContextMenu } from 'primeng/contextmenu';
import { PrintService } from '../services/print.service';
import { MessageService } from 'primeng/api';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent {
  isDataLoading = false;
  cols = [
    { field: 'invoiceNumber', header: 'Invoice Number' },
    { field: 'supplyDate', header: 'Supply Date' },
    { field: 'contact', header: 'Contact' },
    { field: 'totalAmount', header: 'Total Amount' },
    { field: 'state', header: 'State' },
    { field: 'city', header: 'City' },
    { field: 'address', header: 'Address' }];
  data = [];
  contextMenus: any[];
  @Output() openCompaniesForm = new EventEmitter();
  filterFields = [];
  printInvoiceDetails: any;
  @ViewChild('cm') contextMenu: ContextMenu

  constructor(private readonly printService: PrintService,
    private readonly messageService: MessageService,
    private readonly invoiceService: InvoiceService) {
  }

  async ngOnInit() {
    this.fetchData();
    this.invoiceService.refetchData.subscribe(() => this.fetchData());
  }

  async fetchData() {
    this.isDataLoading = true;
    try {
      let response: any = await this.invoiceService.getInvoices();
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
        {
          label: 'Print',
          data: data,
          command: (data) => this.printInvoice(data)

        },
      ];
    }
    this.contextMenu.show(event);
  }

  async deleteClient(data) {
    await this.invoiceService.deleteInvoice(data.item.data.invoiceId);
    this.invoiceService.refetchData.next(true);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  async printInvoice(selectedInvoice: any) {
    try {
      let response = await this.invoiceService.getInvoice(selectedInvoice.item.data.invoiceId);
      this.printInvoiceDetails = response.data;
      this.printInvoiceDetails = Object.entries(this.printInvoiceDetails).reduce((a: any, [k, v]) => (v == null ? a : (a[k] = v, a)), {});
      this.printService.generatePDF(this.getPrintConfiguration());
    } catch (err) {

    }
  }

  getPrintConfiguration() {
    try {
      let hsnCodes: any = [];
      let subData: any = [];
      let currentCompany = JSON.parse(localStorage.getItem(COMPANY));
      this.printInvoiceDetails?.invoiceItems?.forEach((inv: any, index: number) => {
        if (!hsnCodes.includes(inv.hsnCode)) {
          hsnCodes.push(inv.hsnCode);
        }
      });
      hsnCodes?.forEach((hsnCode: any) => {
        let tempInvoiceDetails: any = { hsnCode: hsnCode, quantity: 0, gst: 0, taxableAmount: 0, cgst: 0, sgst: 0 };
        tempInvoiceDetails.gst = Number(this.printInvoiceDetails.cgstPercent) + Number(this.printInvoiceDetails.sgstPercent);
        this.printInvoiceDetails?.invoiceItems?.forEach((inv: any) => {
          if (inv.hsnCode === hsnCode) {
            tempInvoiceDetails.quantity += inv.quantity;
            tempInvoiceDetails.taxableAmount += Number(inv.amount);
            tempInvoiceDetails.cgst = (tempInvoiceDetails.taxableAmount * Number(this.printInvoiceDetails.cgstPercent)) / 100;
            tempInvoiceDetails.sgst = (tempInvoiceDetails.taxableAmount * Number(this.printInvoiceDetails.sgstPercent)) / 100;
          }
        });
        subData.push(tempInvoiceDetails);
      });
      return {
        content: [
          {
            text: 'TAX INVOICE',
            fontSize: 13,
            bold: true,
            alignment: 'center',
            color: '#000'
          },
          {
            text: `${currentCompany?.companyName}`,
            fontSize: 16,
            alignment: 'center',
            color: '#ff0000',
            italics: true
          },
          {
            text: 'Manufacturer of Readymade Garments',
            fontSize: 11,
            bold: true,
            alignment: 'center',
            color: '#000'
          },
          {
            text: 'Add: Room No. 3. FSM 10/3/CEN-95 SK 144, Babu seth Chawl, Sewri Koliwada (E), Mumbai - 400 015',
            fontSize: 9,
            alignment: 'center',
            color: '#000'
          },
          {
            text: `Mobile: ${currentCompany.contact} Email: ${currentCompany.email}`,
            fontSize: 9,
            bold: true,
            alignment: 'center',
            color: '#000',
          },
          {
            columns: [
              [
                { text: `GSTIN: ${currentCompany.gst}`, margin: [0, 15, 0, 2], decoration: 'underline', bold: true },
                {
                  text: this.printInvoiceDetails.client,
                  bold: true
                },
                { text: `${this.printInvoiceDetails.address}`, margin: [0, 0, 5, 0] },
                { text: `State: ${this.printInvoiceDetails.state}` },
                { text: `Tel No: ${this.printInvoiceDetails.contact}` },
                { text: `GST No: ${this.printInvoiceDetails.gstNumber}` }
              ],
              [
                {
                  text: `Tax is Payable On Reverse Change: `,
                  alignment: 'left',
                  margin: [0, 15, 0, 2],
                  decoration: 'underline',
                  bold: true
                },
                {
                  text: `Invoice No : ${this.printInvoiceDetails.invoiceNumber}`,
                  alignment: 'left'
                },
                {
                  text: `Transport: ${this.printInvoiceDetails.transportMode}`,
                  alignment: 'left'
                },
                {
                  text: `Date & Time of Supply: ${this.printInvoiceDetails.supplyDate}`,
                  alignment: 'left'
                }
              ],
            ]
          },
          {
            margin: [0, 15, 0, 2],
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
              body: [
                ['Sr No', 'Design No', 'Description', 'HSN Code', 'Quantity', 'Rate', 'Amount'],
                ...this.printInvoiceDetails?.invoiceItems?.map((inv: any, index: number) =>
                  ([index + 1, inv.code, inv.description, inv.hsnCode, inv.quantity, inv.rate, inv.amount])),
                [{ text: `Rupees in words: ${this.printInvoiceDetails.amountInWords}`, colSpan: 3, rowSpan: 2 }, {}, {}, { text: `CGST: ${this.printInvoiceDetails.cgstPercent} %`, bold: true, colSpan: 2 }, {}, { text: this.printInvoiceDetails.cgstAmount, colSpan: 2, alignment: 'center' }, {}],
                [{}, {}, {}, { text: `SGST: ${this.printInvoiceDetails.sgstPercent} %`, bold: true, colSpan: 2 }, {}, { text: this.printInvoiceDetails.sgstAmount, colSpan: 2, alignment: 'center' }, {}],
                [{}, {}, {}, { text: 'Total Amount', bold: true, colSpan: 2 }, {}, { text: this.printInvoiceDetails.totalAmount, bold: true, colSpan: 2, alignment: 'center' }, {}],
              ]
            }
          },
          {
            margin: [0, 15, 0, 2],
            table: {
              headerRows: 1,
              widths: ["*", 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                ['HSN Code', 'Pcs', 'GST', 'Taxable Value', 'CGST', 'SGST'],
                ...subData?.map((inv: any) =>
                  ([inv.hsnCode, inv.quantity, inv.gst, inv.taxableAmount, inv.cgst, inv.sgst])),
              ]
            }
          },
          {
            text: 'Terms and Conditions',
            style: 'sectionHeader',
            italics: true
          },
          {
            columns: [
              [{
                italics: true,
                ol: [
                  'Payment within 45 Days SUBJECT TO MUMBAI JURISDICTION.',
                  'In case of unpaid bill interest @24% will be charged extra from the date of bill.',
                  'Payment of this bill will be accepted only by payee A/c or draft.',
                  'Goods once sold not be taken back.',
                  'Once the goods are delivered We are not responsible for any claim.',
                ],
              }],
            ]
          },
          {
            columns: [
              [{
                margin: [0, 15, 0, 2],
                text: 'Certified the particular given above are true correct & the amount indicated represent th price actually charged and their is no flow of additional consideration directly & indirectly from the buyers.'
              }],
              [
                {
                  margin: [0, 15, 0, 2],
                  text: `FOR ${currentCompany.companyName}`, alignment: 'right'
                },
                {
                  text: ' Auth. Signatory', alignment: 'right', margin: [0, 40, 0, 2]
                }
              ],
            ]
          },
        ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 10, 0, 10]
          }
        }
      };
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error while generating invoice', detail: err });
      return null;
    }

  }

}
