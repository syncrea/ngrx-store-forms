import { Component } from '@angular/core';
import { FormGroupState } from '../../lib/model';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay, filter } from 'rxjs/operators';
import { UpdateStoreFormAction } from '../../lib/reducer';

export class CustomUpdateAction implements Action {
  readonly type = 'CustomUpdateAction';
}

export class AddFormArrayItemAction implements Action {
  readonly type = 'AddFormArrayItemAction';
}

@Component({
  selector: 'rxsf-form1-container',
  templateUrl: './form1-container.component.html',
  styleUrls: ['./form1-container.component.css']
})
export class Form1ContainerComponent {
  formGroup: FormGroup;
  formState: Observable<FormGroupState>;

  formArrayGroup: FormGroup;
  formArrayState: Observable<FormGroupState>;

  constructor(private fb: FormBuilder, private store: Store<any>) {
    this.formGroup = fb.group({
      'name': ['', Validators.required],
      'userName': ['', Validators.required, (control: AbstractControl) => this.validateUserNameTaken(control)]
    });
    this.formState = store.select((state: any) => state.testForm.form1);

    this.formArrayGroup = fb.group({
      items: fb.array([])
    });
    this.formArrayState = store.select(state => state.testForm.form2);
    // this
    //   .formArrayState
    //   .pipe(
    //   filter(state => !!state && !!state.value && !!this.formArrayGroup)
    //   )
    //   .subscribe(result => {
    //     const items = <any>result.value.items;
    //     const controls = !!!items ? [] : items.map(item => {
    //       return this.fb.group({
    //         name: [item.name]
    //       });
    //     });
    //     this.formArrayGroup.setControl('items', this.fb.array(controls));
    //   });
  }

  validateUserNameTaken(control: AbstractControl) {
    return of(control.value !== 'root' ? null : { userNameTaken: true })
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

  addFormArrayItem() {
    this.store.dispatch(new AddFormArrayItemAction());
  }
}
