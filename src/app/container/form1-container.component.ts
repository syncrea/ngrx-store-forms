import {Component} from '@angular/core';
import {FormGroupState} from '../../lib/model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {delay} from 'rxjs/operators';
import {UpdateStoreFormAction} from '../../lib/reducer';

export class CustomUpdateAction implements Action {
  readonly type = 'CustomUpdateAction';
}

@Component({
  selector: 'rxsf-form1-container',
  templateUrl: './form1-container.component.html',
  styleUrls: ['./form1-container.component.css']
})
export class Form1ContainerComponent {
  formGroup: FormGroup;
  formState: Observable<FormGroupState>;

  constructor(private fb: FormBuilder, private store: Store<any>) {
    this.formGroup = fb.group({
      'name': ['', Validators.required],
      'userName': ['', Validators.required, (control: AbstractControl) => this.validateUserNameTaken(control)]
    });
    this.formState = store.select((state: any) => state.testForm.form1);
  }

  validateUserNameTaken(control: AbstractControl) {
    return of(control.value !== 'root' ? null : {userNameTaken: true})
      .pipe(
        delay(2000)
      );
  }

  reset() {
    this.store.dispatch(new UpdateStoreFormAction('testForm.form1', {
      name: 'Reset'
    }));
  }

  resetCustom() {
    this.store.dispatch(new CustomUpdateAction());
  }
}
