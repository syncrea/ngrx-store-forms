import {FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {filter, map, startWith} from 'rxjs/operators';
import {Inject, Injectable, Optional} from '@angular/core';
import {noStoreError, noStoreFormBinding} from './errors';
import {STORE_FORMS_CONFIG} from './tokens';
import {ErrorMessages, FormGroupState, StoreFormBinding, StoreFormsBindingStrategy, StoreFormsConfig} from './model';
import {deepEquals, deepGet} from './helper';
import {UpdateStoreFormStateAction} from './reducer';

@Injectable()
export class BindingService {
  private bindings: {[k: string]: StoreFormBinding} = {};

  constructor(@Inject(STORE_FORMS_CONFIG) private config: StoreFormsConfig,
              @Optional() private store: Store<any>) {
    if (!this.store) {
      noStoreError();
    }
  }

  bind(path: string, formGroup: FormGroup) {
    const formGroupSubscription = formGroup.statusChanges
      .pipe(
        startWith(true)
      )
      .subscribe(() => {
        this.store.dispatch(new UpdateStoreFormStateAction(path, {
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
          errors: this.getErrors(path, formGroup)
        }));
      });

    this.bindings[path] = {
      path,
      formGroup,
      formGroupSubscription
    };

    if (this.config.bindingStrategy === 'ObserveStore') {
      this.bindings[path].storeSubscription = this.store
        .pipe(
          map((state) => deepGet(state, path)),
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

  private getErrors(path: string, formGroup: FormGroup) {
    if (!this.config.errorMessages) {
      return {};
    }

    const errorMessages: ErrorMessages = deepGet(this.config.errorMessages, path);

    return Object.keys(formGroup.controls).reduce((groupErrors, controlName: string) => {
      const control = formGroup.controls[controlName];
      if (control.errors) {
        groupErrors[controlName] = Object.keys(control.errors).reduce((errors, validatorKey) => {
          if (control.errors &&
            control.errors[validatorKey] &&
            errorMessages[controlName] && errorMessages[controlName][validatorKey]) {
            const errorMessage = errorMessages[controlName][validatorKey];
            if (errors.indexOf(errorMessage) === -1) {
              errors.push(errorMessage);
            }
          }
          return errors;
        }, <string[]>[]);
      }
      return groupErrors;
    }, {});
  }

  unbind(path: string) {
    this.bindings[path].formGroupSubscription.unsubscribe();
    if (this.bindings[path].storeSubscription) {
      this.bindings[path].storeSubscription.unsubscribe();
    }
    delete this.bindings[path];
  }

  updateFormGroup(path: string, value: {[k: string]: string}) {
    if (!this.bindings[path]) {
      noStoreFormBinding(path);
    }

    const binding = this.bindings[path];
    binding.formGroup.patchValue(value);
  }
}
