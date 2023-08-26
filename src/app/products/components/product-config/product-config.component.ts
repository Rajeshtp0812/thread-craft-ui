import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';

const EXPRESSION_EVAL_FIELDS = ['average'];

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
  form: FormGroup;
  evaluatedResults: { [key: string]: any } = {}; // Object to hold evaluated results
  @Output() formData = new EventEmitter();
  @Input() set editProductDetails(value) {
    if (value) {
      this.setFormData(value);
    }
  }

  @Input() set isFormOpen(value: boolean) {
    if (!value) {
      this.form.reset();
      this.uploadedFiles = [];
      this.evaluatedResults = {};
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
        this.evaluateExpression(key);
      });
    });
  }

  sendFormData() {
    const formData = new FormData();
    let products = this.form.getRawValue();
    const date = DateTime.fromJSDate(new Date(products['date']));
    const formattedDate = date.toFormat('dd/MM/yyyy');
    products['date'] = formattedDate;

    Object.entries(products).forEach((product: any) => {
      formData.append(product[0], product[1]);
    });
    if (this.uploadedFiles) {
      formData.append('image', this.uploadedFiles[0]);
    }
    this.formData.emit({ data: formData, status: this.form.status });
  }

  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      this.sendFormData()
    }
  }

  evaluateExpression(controlName: string) {
    const expression = this.form.get(controlName)?.value;
    try {
      if (!expression) {
        this.evaluatedResults[controlName] = '';
        return;
      }
      const result = eval(expression);
      this.evaluatedResults[controlName] = `${expression} = ${result}`;
    } catch (error) {
      this.evaluatedResults[controlName] = 'Invalid expression';
    }
  }

  setFormData(value) {
    let formCtrl = this.form.controls;
    Object.keys(this.form.controls).forEach(key => {
      if (key === 'date') {
        formCtrl[key].setValue(DateTime.fromFormat(value[key], 'dd/MM/yyyy'));
      }
      formCtrl[key].setValue(value[key]);
    });
  }
}
