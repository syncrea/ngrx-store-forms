import {FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {filter, map, startWith} from 'rxjs/operators';
import {Inject, Injectable, Optional} from '@angular/core';
import {noStoreError, noStoreFormBinding} from './errors';
import {STORE_FORMS_CONFIG, STORE_FORMS_FEATURE} from './tokens';
import {FormGroupState, StoreFormBinding, StoreFormsConfig} from './store-forms.model';
import {deepEquals, deepGet, getErrors} from './helper';
import {UpdateStoreFormStateAction} from './store-forms.actions';
import {debounceTime} from "rxjs/internal/operators";

@Injectable()
export class StoreFormsService {
  private bindings: {[k: string]: StoreFormBinding} = {};
  private pathPrefix = '';

  constructor(@Inject(STORE_FORMS_CONFIG) private config: StoreFormsConfig,
              @Optional() private store: Store<any>,
              @Inject(STORE_FORMS_FEATURE) @Optional() private feature: string) {
    if (!this.store) {
      noStoreError();
    }

    if (this.feature) {
      this.pathPrefix = `${feature}.`;
    }
  }

  bind(path: string, formGroup: FormGroup) {
    const pathWithPrefix = `${this.pathPrefix}${path}`;
    let pipes = [
      startWith(true)
    ];

    if (this.config.debounce) {
      pipes = [...pipes, debounceTime(this.config.debounce)];
    }

    const formGroupSubscription = formGroup.statusChanges
      .pipe(...pipes)
      .subscribe(() => {
        this.store.dispatch(new UpdateStoreFormStateAction(pathWithPrefix, {
          value: {
            ...formGroup.getRawValue()
          },
          untouched: formGroup.untouched,
          touched: formGroup.touched,
          pristine: formGroup.pristine,
          dirty: formGroup.dirty,
          valid: formGroup.valid,
          invalid: formGroup.invalid,
          pending: formGroup.pending,
          errors: getErrors(formGroup, this.config.errorMessages, pathWithPrefix.split('.'))
        }));
      });

    this.bindings[pathWithPrefix] = {
      path: pathWithPrefix,
      formGroup,
      formGroupSubscription
    };

    if (this.config.bindingStrategy === 'ObserveStore') {
      this.bindings[pathWithPrefix].storeSubscription = this.store
        .pipe(
          map((state) => deepGet(state, pathWithPrefix)),
          filter((formState: FormGroupState) => {
            // Very simple dirty checking by comparing current values in
            // state to values in form group using deep equal to prevent
            // infinite loop setValue -> store -> setValue -> store ...
            return formState &&
              formState.value &&
              Object.keys(formState.value).length !== 0 &&
              !deepEquals(formState.value, formGroup.getRawValue());
          })
        )
        .subscribe((formState: FormGroupState) => {
          formGroup.setValue(formState.value);
        });
    }
  }

  unbind(path: string) {
    const pathWithPrefix = `${this.pathPrefix}${path}`;
    if (!this.bindings[pathWithPrefix]) {
      return;
    }

    this.bindings[pathWithPrefix].formGroupSubscription.unsubscribe();
    if (this.bindings[pathWithPrefix].storeSubscription) {
      this.bindings[pathWithPrefix].storeSubscription.unsubscribe();
    }
    delete this.bindings[pathWithPrefix];
  }

  replaceBinding(path: string, replace: FormGroup) {
    this.unbind(path);
    this.bind(path, replace);
  }

  getFormGroup(path: string) {
    const pathWithPrefix = `${this.pathPrefix}${path}`;
    if (this.bindings[pathWithPrefix]) {
      return this.bindings[pathWithPrefix].formGroup;
    } else {
      return null;
    }
  }

  updateFormGroup(path: string, value: {[k: string]: string}) {
    const pathWithPrefix = `${this.pathPrefix}${path}`;
    if (!this.bindings[pathWithPrefix]) {
      noStoreFormBinding(pathWithPrefix);
    }

    const binding = this.bindings[pathWithPrefix];
    binding.formGroup.setValue(value);
  }
}
