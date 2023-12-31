import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';

const EXPRESSION_EVAL_FIELDS = ['average', 'embroidary', 'fittingStich', 'buttonStich',
  'print', 'pintex', 'kMaking', 'tag', 'label', 'making', 'canvas'];

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-product-config',
  templateUrl: './product-config.component.html',
  styleUrls: ['./product-config.component.scss']
})
export class ProductConfigComponent {
  uploadedFiles: any[] = [];
  editPreviewImg = null;
  form: FormGroup;
  evaluatedResults: { [key: string]: any } = {}; // Object to hold evaluated results
  @Output() formData = new EventEmitter();
  totalAmount = 0;
  @Input() set editProductDetails(value) {
    if (value) {
      this.editPreviewImg = structuredClone(value?.image);
      this.setFormData(value);
    }
  }

  @Input() set isFormOpen(value: boolean) {
    if (!value) {
      this.form.reset();
      this.uploadedFiles = [];
      this.evaluatedResults = {};
      this.totalAmount = 0;
    }
  }

  constructor(private datePipe: DatePipe) {
    this.form = new FormGroup({
      date: new FormControl(''),
      details: new FormControl(''),
      rate: new FormControl(''),
      code: new FormControl(''),
      size: new FormControl(''),
      runNo: new FormControl(''),
      billNo: new FormControl(''),
      average: new FormControl(''),
      embroidary: new FormControl(''),
      fittingStich: new FormControl(''),
      buttonStich: new FormControl(''),
      print: new FormControl(''),
      pintex: new FormControl(''),
      kMaking: new FormControl(''),
      tag: new FormControl(''),
      label: new FormControl(''),
      making: new FormControl(''),
      canvas: new FormControl(''),
    });
    this.onValueChanges();

  }

  onValueChanges() {
    this.form.valueChanges.subscribe(() => {
      this.sendFormData()
    });
    EXPRESSION_EVAL_FIELDS.forEach(key => {
      this.form.controls[key].valueChanges.subscribe(() => {
        if (key === 'average') {
          this.evaluateExpression(key);
        }
        if (this.form.get(key)?.value && this.form.get(key)?.value !== '') {
          this.totalAmount += Number(Number(eval(this.form.get(key)?.value)).toFixed(2));
        }
      });
    });
  }

  sendFormData() {
    const formData = new FormData();
    let products = this.form.getRawValue();
    Object.keys(products).forEach(key => (products[key] = products[key] === null ? '' : products[key]));
    const date = typeof products['date'] === 'string' ? DateTime.fromFormat(products['date'], 'dd/MM/yyyy') : DateTime.fromJSDate(new Date(products['date']));
    products['date'] = date.toFormat("dd/MM/yyyy");
    products['totalAmount'] = this.totalAmount;
    Object.entries(products).forEach((product: any) => {
      formData.append(product[0], product[1]);
    });
    if (this.uploadedFiles.length) {
      formData.append('image', this.uploadedFiles[0]);
    } else if (!this.uploadedFiles.length && this.editPreviewImg === '') {
      formData.append('image', '');
    }
    this.formData.emit({ data: formData, status: this.form.status });
  }

  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      this.editPreviewImg = '';
      this.sendFormData()
    }
  }

  removeImage() {
    this.editPreviewImg = '';
    this.sendFormData(); // Update the form data
  }

  evaluateExpression(controlName: string) {
    const expression = this.form.get(controlName)?.value;
    try {
      if (!expression) {
        this.evaluatedResults[controlName] = '';
        return;
      }
      const result = Number(eval(expression)).toFixed(2);
      this.evaluatedResults[controlName] = `${expression} = ${result}`;
    } catch (error) {
      this.evaluatedResults[controlName] = 'Invalid expression';
    }
  }

  setFormData(value) {
    let formCtrl = this.form.controls;
    Object.keys(this.form.controls).forEach(key => {
      formCtrl[key].setValue(value[key]);
    });
  }
}
