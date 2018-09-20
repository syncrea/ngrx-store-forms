import {Component} from '@angular/core';
import {FormGroupState} from 'ngrx-store-forms';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {LoadUserFormAction, LoadUserFormSuccessAction} from './user-form.actions';
import {Actions} from '@ngrx/effects';
import {filter, map, take} from 'rxjs/operators';
import {UserAddress} from './user-form.model';

@Component({
  selector: 'app-user-form-container',
  template: `
    <app-user-form [userFormGroup]="userFormGroup"
                    [formState]="userFormState | async"
                    (outRemoveAddress)="removeAddress($event)"
                    (outAddAddress)="addAddress()">
    </app-user-form>
  `
})
export class UserFormContainerComponent {
  userFormGroup: FormGroup;
  userFormState: Observable<FormGroupState>;

  constructor(private fb: FormBuilder,
              private store: Store<any>,
              private actions: Actions) {

    this.store.dispatch(new LoadUserFormAction());

    this.userFormState = store.select((state: any) => state.userForm.form);
    this.userFormGroup = fb.group({
      name: '',
      userName: '',
      addresses: []
    });

    this.actions.pipe(
      filter((action: Action) => action instanceof LoadUserFormSuccessAction),
      take(1),
      map((action: LoadUserFormSuccessAction) => fb.group({
        name: action.userForm.name,
        userName: action.userForm.userName,
        addresses: fb.array(action.userForm.addresses.map((address) => fb.group(address)))
      }))
    ).subscribe((serverFormGroup: FormGroup) => this.userFormGroup = serverFormGroup);
  }

  removeAddress(index: number) {
    const addresses = this.userFormGroup.get('addresses') as FormArray;
    addresses.removeAt(index);
  }

  addAddress() {
    const addresses = this.userFormGroup.get('addresses') as FormArray;
    addresses.push(this.fb.group(<UserAddress>{
      street: '',
      city: '',
      postalCode: '',
      country: ''
    }));
  }
}
