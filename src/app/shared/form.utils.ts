import {AbstractControl, FormGroup} from '@angular/forms';

export class FormUtils {

  public constructor(private form: FormGroup) {
  }

  public getField(fieldName: string): AbstractControl {
    return this.form.get(fieldName);
  }

  public showFieldError(fieldName: string): boolean {
    const field = this.getField(fieldName);
    return field.invalid && (field.dirty || field.touched);
  }

  public showSuccessOrError(fieldName: string): object {
    return {
      'is-valid': this.getField(fieldName).valid,
      'is-invalid': this.showFieldError(fieldName)
    };
  }

}
