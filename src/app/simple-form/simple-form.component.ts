import {Component, Input} from '@angular/core';
import {FormGroupState} from '../../lib/model';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'rxsf-simple-form',
  template: `
    <form [formGroup]="formGroup"
          rxsfBinding="simpleForm.form"
          novalidate>
      <label style="display: block">
        <span>Name:</span>
        <input formControlName="name" type="text">
      </label>
      <ng-container *ngIf="formState.dirty">
        <div style="color: red" *ngFor="let error of formState.errors?.name">
          {{error}}
        </div>
      </ng-container>

      <label style="display: block">
        <span>Username (root is already taken):</span>
        <input formControlName="userName" type="text">
      </label>
      <ng-container *ngIf="formState.dirty">
        <div style="color: red" *ngFor="let error of formState.errors?.userName">
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
  @Input() formState: FormGroupState;
}
