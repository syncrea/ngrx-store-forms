import {Component, Input} from '@angular/core';
import {FormGroupState} from '../../lib/model';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'rxsf-form1',
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.css']
})
export class Form1Component {
  @Input() formGroup: FormGroup;
  @Input() formState: FormGroupState;
}
