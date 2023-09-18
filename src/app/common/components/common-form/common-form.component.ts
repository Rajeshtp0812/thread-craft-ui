import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CountryStateCityService } from '../../service/country-state-city.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CONTACT, EMAIL, GST, PIN_CODE, customPatternValidator } from '../../validators/customValidators';

export enum WRAPPER_COMPONENT {
  COMPANY = 'company',
  CLIENT = 'client',
  VENDOR = 'vendor'
}

@Component({
  selector: 'app-common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.scss']
})
export class CommonFormComponent implements OnInit, OnChanges {
  readonly select = 'Select';
  readonly required = 'required';
  statesOptions: string[] = [];
  citiesOptions: string[] = [];
  selectedState = '';
  selectedCity = '';
  form: FormGroup;
  formRequiredFields = {
    companyName: '',
    email: '',
    contact: '',
    gst: '',
    address: 'required',
    state: 'required',
    city: 'required',
    pinCode: 'required'
  }

  @Input() wrapperComponentName: string;

  @Output() formData = new EventEmitter<any>();

  @Input() set clearForm(value) {
    if (!value) {
      this.form.reset();
      this.citiesOptions = [];
    }
  }

  @Input() updateFormData;

  constructor(private readonly stateCityService: CountryStateCityService) {
    this.form = new FormGroup({
      companyName: new FormControl(''),
      email: new FormControl('', [customPatternValidator(EMAIL, 'Email is invalid')]),
      contact: new FormControl('', [customPatternValidator(CONTACT, 'Contact is invalid')]),
      gst: new FormControl('', [customPatternValidator(GST, 'GST number is invalid')]),
      address: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      pinCode: new FormControl('', [Validators.required, customPatternValidator(PIN_CODE, 'Pin code is invalid')]),

    }, { updateOn: 'blur' });
    this.onFormControlValueChanges();
  }

  ngOnInit(): void {
    this.statesOptions = this.stateCityService.getStatesByCountry('IN');
    this.statesOptions.unshift(this.select);
    this.emitFormData()
  }

  onFormControlValueChanges() {
    this.form.valueChanges.subscribe(() => {
      this.emitFormData();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    let formCtrl = this.form.controls;
    if (this.wrapperComponentName === WRAPPER_COMPONENT.COMPANY) {
      this.formRequiredFields.companyName = this.required;
      formCtrl['companyName'].addValidators(Validators.required)
    } else if (this.wrapperComponentName === WRAPPER_COMPONENT.CLIENT) {
      this.formRequiredFields.contact = this.required;
      formCtrl['contact'].addValidators(Validators.required)
    } else if (this.wrapperComponentName === WRAPPER_COMPONENT.VENDOR) {
      this.formRequiredFields.companyName = this.required;
      this.formRequiredFields.contact = this.required;
      formCtrl['companyName'].addValidators(Validators.required)
      formCtrl['contact'].addValidators(Validators.required)
    }
    if (changes['updateFormData']?.currentValue) {
      this.setupFormData();
    }
  }

  emitFormData() {
    if (this.form.status === 'VALID') {
      this.formData.emit({ data: this.form.getRawValue(), status: true });
    } else {
      this.formData.emit({ data: this.form.getRawValue(), status: false });
    }
  }

  selectState(event: any) {
    this.selectedState = '';
    if (event.value !== this.select) {
      this.selectedState = event.value;
      this.citiesOptions = this.stateCityService.getCitiesByState('IN', this.selectedState);
      this.citiesOptions.unshift(this.select)
    } else {
      this.citiesOptions = [];
    }
    this.emitFormData()
  }

  setupFormData() {
    let formCtrl = this.form.controls;
    this.citiesOptions = this.stateCityService.getCitiesByState('IN', this.updateFormData['state']);
    Object.keys(this.form.controls).forEach(key => {
      formCtrl[key].setValue(this.updateFormData[key]);
    });
    this.emitFormData();
  }
}
