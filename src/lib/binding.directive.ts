import {Directive, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {FormGroupDirective} from '@angular/forms';
import {BindingService} from './binding.service';
import {Store} from '@ngrx/store';
import {noFormGroupError, noStoreError} from './errors';

@Directive({
  selector: '[rxsfBinding]'
})
export class BindingDirective implements OnInit, OnDestroy {
  @Input() rxsfBinding: string;

  constructor(@Self() @Optional() private formGroupDirective: FormGroupDirective,
              @Optional() private store: Store<any>,
              private bindingService: BindingService) {
    if (!this.formGroupDirective) {
      noFormGroupError();
    }

    if (!this.store) {
      noStoreError();
    }
  }

  ngOnInit() {
     this.bindingService.bind(
        this.rxsfBinding,
        this.formGroupDirective.form
      );
  }

  ngOnDestroy() {
    this.bindingService.unbind(this.rxsfBinding);
  }
}
