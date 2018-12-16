import {Directive, ElementRef, OnDestroy, OnInit, Optional, SkipSelf} from '@angular/core';
import {StoreFormsService} from './store-forms.service';
import {BindingDirective} from './binding.directive';

@Directive({
  // tslint:disable-next-line
  selector: 'input[formControlName],input[formControl]'
})
export class TouchedUpdateDirective implements OnDestroy, OnInit {
  private blurListener: Function;

  constructor(private elementRef: ElementRef,
              @SkipSelf() @Optional() private binding: BindingDirective,
              private storeFormsService: StoreFormsService) {
  }

  ngOnInit() {
    if (!this.binding) {
      return;
    }

    this.blurListener = () => this.storeFormsService.triggerUpdate(this.binding.rxsfBinding);
    this.elementRef.nativeElement.addEventListener('blur', this.blurListener);
  }

  ngOnDestroy() {
    if (this.blurListener) {
      this.elementRef.nativeElement.removeEventListener('blur', this.blurListener);
    }
  }
}
