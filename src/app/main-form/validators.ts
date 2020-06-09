import { AbstractControl, ValidatorFn } from '@angular/forms';

export function lengthValidator(len1, len2): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (len1 != len2) {
            return { creditCard: 'Your credit card number is not from a supported credit card provider' };
        }
        return null;
    };

}