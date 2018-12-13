import {Component, Input} from '@angular/core';
import {FormGroupState} from 'ngrx-store-forms';
import {FormGroup} from '@angular/forms';

export interface SimpleForm {
  name: string;
  userName: string;
}

@Component({
  selector: 'app-simple-form',
  template: `
    <form [formGroup]="formGroup"
          rxsfBinding="simpleForm.form"
          novalidate>
      <label style="display: block">
        <span>Name:</span>
        <input formControlName="name" type="text">
      </label>
      <ng-container *ngIf="formState.dirty">
        <div style="color: red" *ngFor="let error of formState.fields.name.errors">
          {{error}}
        </div>
      </ng-container>

      <label style="display: block">
        <span>Username (root is already taken):</span>
        <input formControlName="userName" type="text">
      </label>
      <ng-container *ngIf="formState.dirty">
        <div style="color: red" *ngFor="let error of formState.fields.userName.errors">
          {{error}}
        </div>
      </ng-container>

      <div [style.background]="formState.valid ? 'green' : 'red'">
        {{formState.valid ? 'VALID' : 'INVALID'}}
      </div>
      <div>{{formState | json}}</div>
    </form>
  `
})
export class SimpleFormComponent {
  @Input() formGroup: FormGroup;
  @Input() formState: FormGroupState<SimpleForm>;
}
