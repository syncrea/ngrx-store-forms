import {FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {filter, map, startWith} from 'rxjs/operators';
import {Inject, Injectable, Optional} from '@angular/core';
import {noStoreError, noStoreFormBinding} from './errors';
import {STORE_FORMS_CONFIG} from './tokens';
import {ErrorMessages, FormGroupState, StoreFormBinding, StoreFormsConfig} from './store-forms.model';
import {deepEquals, deepGet} from './helper';
import {UpdateStoreFormStateAction} from './store-forms.actions';
import {STORE_FORMS_FEATURE} from './tokens';

@Injectable()
export class StoreFormsService {
  private bindings: {[k: string]: StoreFormBinding} = {};
  private pathPrefix = '';

  constructor(@Inject(STORE_FORMS_CONFIG) @Optional() private config: StoreFormsConfig,
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

    const formGroupSubscription = formGroup.statusChanges
      .pipe(
        startWith(true)
      )
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
          errors: this.getErrors(path, formGroup)
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
    const pathWithPrefix = `${this.pathPrefix}${path}`;
    this.bindings[pathWithPrefix].formGroupSubscription.unsubscribe();
    if (this.bindings[pathWithPrefix].storeSubscription) {
      this.bindings[pathWithPrefix].storeSubscription.unsubscribe();
    }
    delete this.bindings[pathWithPrefix];
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
    binding.formGroup.patchValue(value);
  }
}
