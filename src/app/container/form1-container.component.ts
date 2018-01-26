import {Component} from '@angular/core';
import {FormGroupState} from '../../lib/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

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
      'ctrl1': ['', Validators.required]
    });
    this.formState = store.select((state: any) => state.testForm.feature1.state.form1);
  }
}
