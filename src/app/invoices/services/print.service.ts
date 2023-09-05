import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { MessageService } from 'primeng/api';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root'
})
export class PrintService {

    constructor(private readonly messageService: MessageService) { }

    generatePDF(docsDefinition: any) {
        try {
            pdfMake.createPdf(docsDefinition).print();
        } catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Unexpected system error while generating invoice', detail: err });
        }
    }
}
