import { Component } from '@angular/core';
import { FormGroupState } from '../../lib/model';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';
import { UpdateStoreFormAction } from '../../lib/reducer';
import { CustomUpdateAction } from './simple-form.actions';

@Component({
  selector: 'rxsf-simple-form-container',
  template: `
    <rxsf-simple-form [formGroup]="formGroup"
                      [formState]="formState | async">
    </rxsf-simple-form>
    <button (click)="reset()">Reset</button>
    <button (click)="resetCustom()">Custom Reset</button>
  `
})
export class SimpleFormContainerComponent {
  formGroup: FormGroup;
  formState: Observable<FormGroupState>;

  constructor(private fb: FormBuilder, private store: Store<any>) {
    this.formGroup = fb.group({
      'name': ['', Validators.required],
      'userName': ['', Validators.required, (control: AbstractControl) => this.validateUserNameTaken(control)]
    });
    this.formState = store.select((state: any) => state.simpleForm.form);
  }

  validateUserNameTaken(control: AbstractControl) {
    return of(control.value !== 'root' ? null : {userNameTaken: true})
      .pipe(
        delay(2000)
      );
  }

  reset() {
    this.store.dispatch(new UpdateStoreFormAction('simpleForm.form', {
      name: 'Reset'
    }));
  }

  resetCustom() {
    this.store.dispatch(new CustomUpdateAction());
  }
}
