import {Directive, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {FormGroupDirective} from '@angular/forms';
import {StoreFormsService} from './store-forms.service';
import {Store} from '@ngrx/store';
import {noFormGroupError, noStoreError} from './errors';

@Directive({
  selector: '[rxsfBinding]'
})
export class BindingDirective implements OnInit, OnDestroy {
  @Input() rxsfBinding: string;

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

  ngOnInit() {
     this.storeFormsService.bind(
        this.rxsfBinding,
        this.formGroupDirective.form
      );
  }

  ngOnDestroy() {
    this.storeFormsService.unbind(this.rxsfBinding);
  }
}
