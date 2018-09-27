import {Directive, Input, OnChanges, OnDestroy, Optional, Self, SimpleChanges} from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import {StoreFormsService} from './store-forms.service';
import {Store} from '@ngrx/store';
import {noFormGroupError, noStoreError} from './errors';

@Directive({
  selector: '[rxsfBinding]'
})
export class BindingDirective implements OnDestroy, OnChanges {
  @Input() rxsfBinding: string;
  @Input() formGroup: FormGroup;

  constructor(@Self() @Optional() private formGroupDirective: FormGroupDirective,
              @Optional() private store: Store<any>,
              private storeFormsService: StoreFormsService) {
    if (!this.formGroupDirective) {
      noFormGroupError();
    }

    if (!this.store) {
      noStoreError();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.formGroup) {
      this.storeFormsService.replaceBinding(
        this.rxsfBinding,
        this.formGroup
      );
    } else if (changes.rxsfBinding) {
      this.storeFormsService.unbind(changes.rxsfBinding.previousValue);
      this.storeFormsService.replaceBinding(
        this.rxsfBinding,
        this.formGroup
      );
    }
  }

  ngOnDestroy() {
    this.storeFormsService.unbind(this.rxsfBinding);
  }
}
