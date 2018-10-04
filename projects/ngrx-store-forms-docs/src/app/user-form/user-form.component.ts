import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroupState} from 'ngrx-store-forms';
import {FormArray, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userFormGroup"
          rxsfBinding="userForm.userForm"
          novalidate>
      <label>Name: <input formControlName="name"></label>
      <label>Username: <input formControlName="userName"></label>
      <div formArrayName="addresses">
        <h3>Addresses:</h3>
        <button (click)="addAddress()">Add new address</button>
        <div *ngFor="let control of addresses.controls; let i = index"
             [formGroupName]="i" class="form-group-{{i}}">
          <div>
            <input formControlName="street"
[style.borderColor]="control.dirty && formState.errors && 
formState.errors['addresses'] && 
formState.errors['addresses'][i]?.street ? 'red' : ''">
            <ng-container *ngIf="control.dirty && 
            formState.errors && formState.errors['addresses'] && 
            formState.errors['addresses'][i]?.street">
              <p *ngFor="let message of formState.errors['addresses'][i].street">{{message}}</p>
            </ng-container>
          </div>
            <input formControlName="city">
          <input formControlName="postalCode">
          <input formControlName="country">
          <button (click)="removeAddress(i)">remove</button>
        </div>
      </div>
    </form>
    <div>
      {{formState | json}}
    </div>
  `
})
export class UserFormComponent {
  @Input() userFormGroup: FormGroup;
  @Input() formState: FormGroupState;
  @Output() outRemoveAddress = new EventEmitter<number>();
  @Output() outAddAddress = new EventEmitter<never>();

  get addresses(): FormArray {
    return this.userFormGroup.get('addresses') as FormArray;
  }

  removeAddress(index: number) {
    this.outRemoveAddress.emit(index);
  }

  addAddress() {
    this.outAddAddress.emit();
  }
}
