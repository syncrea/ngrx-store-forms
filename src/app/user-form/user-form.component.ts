import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroupState } from '../../lib/model';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'rxsf-user-form',
  template: `
    <form [formGroup]="userFormGroup"
          rxsfBinding="userForm.form"
          novalidate>
      <label>Name: <input formControlName="name"></label>
      <label>Username: <input formControlName="userName"></label>
      <div formArrayName="addresses">
        <h3>Addresses:</h3>
        <button (click)="addAddress()">Add new address</button>
        <div *ngFor="let control of addresses.controls; let i = index"
             [formGroupName]="i" class="form-group-{{i}}">
          <input formControlName="street">
          <input formControlName="city">
          <input formControlName="postalCode">
          <input formControlName="country">
          <button (click)="removeAddress(i)">remove</button>
        </div>
      </div>
    </form>
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
