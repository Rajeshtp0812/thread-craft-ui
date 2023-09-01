import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const CONTACT = /^(?:\+91)?[6789]\d{9}$/;
export const GST = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
export const PIN_CODE = /^[0-9]{6}$/;
// Custom pattern validator function
export function customPatternValidator(pattern, errorMsg: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return !control.value || pattern.test(control.value) ? null
            : { errorMsg }
    }
}