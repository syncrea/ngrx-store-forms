import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'rxsf-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.css']
})
export class FormArrayComponent implements OnInit {
  @Input() public formGroup: FormGroup;
  @Output() public addFormArrayItem = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
}
