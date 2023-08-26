import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MODAL_TYPE } from '../../common/constants';
import { ContextMenu } from 'primeng/contextmenu';
import { PrintService } from '../services/print.service';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent {
  isDataLoading = false;
  cols = [
    { field: 'code', header: 'Company Name' },
    { field: 'description', header: 'Email' },
    { field: 'hsnCode', header: 'State' },
    { field: 'quantity', header: 'City' },
    { field: 'rate', header: 'Pin Code' },
    { field: 'amount', header: 'Address' }];
  data = [{
    "code": "1000",
    "description": "f230fh0g3",
    "hsnCode": "Product Description",
    "quantity": "bamboo-watch.jpg",
    "rate": 65,
    "amount": "Accessories",
  }];
  contextMenus: any[];
  @Output() openCompaniesForm = new EventEmitter();
  filterFields = [];
  printInvoiceDetails: any;

  @ViewChild('cm') contextMenu: ContextMenu


  constructor(private readonly printService: PrintService) { }

  ngOnInit(): void {
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

  deleteClient(data) {
    console.log('delete')
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  printInvoice(selectedInvoice: any) {
    this.printInvoiceDetails = Object.entries(selectedInvoice).reduce((a: any, [k, v]) => (v == null ? a : (a[k] = v, a)), {});
    this.printService.generatePDF(this.getPrintConfiguration());
  }

  getPrintConfiguration() {
    let hsn_code_set: any = [];
    let subData: any = [];

    this.printInvoiceDetails?.invoice_details?.forEach((inv: any, index: number) => {
      if (!hsn_code_set.includes(inv.hsn_code)) {
        hsn_code_set.push(inv.hsn_code);
      }
    });
    // hsn_code_set?.forEach((hsn_code: any) => {
    //   let tempInvoiceDetails: any = { hsn_code: hsn_code, quantity: 0, gst: 0, taxable_amount: 0, cgst: 0, sgst: 0 };
    //   tempInvoiceDetails.gst = Number(this.printInvoiceDetails.gst_per) + Number(this.printInvoiceDetails.sgst_per);
    //   this.printInvoiceDetails?.invoice_details?.forEach((inv: any) => {
    //     if (inv.hsn_code === hsn_code) {
    //       tempInvoiceDetails.quantity += inv.quantity;
    //       tempInvoiceDetails.taxable_amount += Number(inv.amount);
    //       tempInvoiceDetails.cgst = (tempInvoiceDetails.taxable_amount * Number(this.printInvoiceDetails.gst_per)) / 100;
    //       tempInvoiceDetails.sgst = (tempInvoiceDetails.taxable_amount * Number(this.printInvoiceDetails.sgst_per)) / 100;
    //     }
    //   });
    //   subData.push(tempInvoiceDetails);
    // });
    let columns = [{ colName: 'code', Field: 'Design No' }, { colName: 'description', Field: 'Description' }, { colName: 'hsn_code', Field: 'HSN Code' },
    { colName: 'quantity', Field: 'Quantity' }, { colName: 'rate', Field: 'Rate' }, { colName: 'amount', Field: 'Amount' }]
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
          text: 'SABA Fashion',
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
          text: 'Mobile: 9819522313 Email: azhar0786.es@gmail.com',
          fontSize: 9,
          bold: true,
          alignment: 'center',
          color: '#000',
        },
        {
          // columns: [
          //   [
          //     { text: `GSTIN: 27AMZPS7428M1ZS`, margin: [0, 15, 0, 2], decoration: 'underline', bold: true },
          //     {
          //       text: this.printInvoiceDetails.user.company_name,
          //       bold: true
          //     },
          //     { text: `${this.printInvoiceDetails.user.address}`, margin: [0, 0, 5, 0] },
          //     { text: `State: ${this.printInvoiceDetails.user.state}` },
          //     { text: `Tel No: ${this.printInvoiceDetails.user.phone_number}` },
          //     { text: `GST No: ${this.printInvoiceDetails.user.gst.toUpperCase()}` }
          //   ],
          //   [
          //     {
          //       text: `Tax is Payable On Reverse Change: `,
          //       alignment: 'left',
          //       margin: [0, 15, 0, 2],
          //       decoration: 'underline',
          //       bold: true
          //     },
          //     {
          //       text: `Invoice No : ${this.printInvoiceDetails.invoice_no}`,
          //       alignment: 'left'
          //     },
          //     {
          //       text: `Transport: ${this.printInvoiceDetails.transport}`,
          //       alignment: 'left'
          //     },
          //     {
          //       text: `Date & Time of Supply: ${this.printInvoiceDetails.supply_date}`,
          //       alignment: 'left'
          //     },
          //     {
          //       text: `Place of Supply: ${this.printInvoiceDetails.supply_place}`,
          //       alignment: 'left'
          //     },
          //   ],
          // ]
        },
        {
          margin: [0, 15, 0, 2],
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
            // body: [
            //   ['Sr No', 'Design No', 'Description', 'HSN_Code', 'Quantity', 'Rate', 'Amount'],
            //   ...this.printInvoiceDetails?.invoice_details?.map((inv: any, index: number) =>
            //     ([index + 1, inv.code, inv.description, inv.hsn_code, inv.quantity, inv.rate, inv.amount])),
            //   [{ text: `Rupees in words: ${this.printInvoiceDetails.amount_in_words}`, colSpan: 3, rowSpan: 2 }, {}, {}, { text: `CGST ${this.printInvoiceDetails.gst_per}`, bold: true, colSpan: 2 }, {}, { text: this.printInvoiceDetails.cgst, colSpan: 2, alignment: 'center' }, {}],
            //   [{}, {}, {}, { text: `SGST ${this.printInvoiceDetails.sgst_per}`, bold: true, colSpan: 2 }, {}, { text: this.printInvoiceDetails.cgst, colSpan: 2, alignment: 'center' }, {}],
            //   [{}, {}, {}, { text: 'Total Amount', bold: true, colSpan: 2 }, {}, { text: this.printInvoiceDetails.total_amount, bold: true, colSpan: 2, alignment: 'center' }, {}],
            // ]
          }
        },
        {
          margin: [0, 15, 0, 2],
          // table: {
          //   headerRows: 1,
          //   widths: ["*", 'auto', 'auto', 'auto', 'auto', 'auto'],
          //   body: [
          //     ['HSN Code', 'Pcs', 'GST', 'Taxable Value', 'CGST', 'SGST'],
          //     ...subData?.map((inv: any) =>
          //       ([inv.hsn_code, inv.quantity, inv.gst, inv.taxable_amount, inv.cgst, inv.sgst])),
          //   ]
          // }
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
                text: 'FOR SABA FASHION', alignment: 'right'
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
  }

}
