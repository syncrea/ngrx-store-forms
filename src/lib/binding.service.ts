import {FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {debounceTime, filter, map, startWith, tap} from 'rxjs/operators';
import {UpdateFormStateAction} from './reducer';
import {Inject, Injectable, Optional} from '@angular/core';
import {noStoreError} from './errors';
import {STORE_FORMS_CONFIG} from './tokens';
import {ErrorMessages, FormGroupConnection, FormGroupState, StoreFormsConfig} from './model';
import {deepEquals, deepGet} from './helper';

@Injectable()
export class BindingService {
  constructor(@Inject(STORE_FORMS_CONFIG) private config: StoreFormsConfig,
              @Optional() private store: Store<any>) {
    if (!this.store) {
      noStoreError();
    }
  }

  bind(path: string, formGroup: FormGroup): FormGroupConnection {
    const formGroupSubscription = formGroup.statusChanges
      .pipe(
        tap((e) =>
          this.store.dispatch(new UpdateFormStateAction({
            path: path,
            state: {
              updating: true
            }
          }))
        ),
        debounceTime(this.config.debounce),
        startWith(true)
      )
      .subscribe(() => {
        this.store.dispatch(new UpdateFormStateAction({
          path: path,
          state: {
            updating: false,
            value: {
              ...formGroup.getRawValue()
            },
            dirty: formGroup.dirty,
            valid: formGroup.valid,
            errors: this.getErrors(path, formGroup)
          }
        }));
      });

    const storeSubscription = this.store
      .pipe(
        map((state) => deepGet(state, path)),
        filter((formState: FormGroupState) => {
          return formState &&
            !formState.updating &&
            formState.value &&
            Object.keys(formState.value).length !== 0 &&
            !deepEquals(formState.value, formGroup.getRawValue());
        })
      )
      .subscribe((formState: FormGroupState) => {
        // If we're updating the form values because of state changes
        // we should not trigger any value change update but need to make
        // sure we trigger any status changes / validator changes
        formGroup.setValue(formState.value, {
          emitEvent: false
        });
        formGroup.markAsDirty();
        formGroup.setErrors(null);
      });

    return {
      formGroup,
      formGroupSubscription,
      storeSubscription
    };
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

  unbind(formGroupConnection: FormGroupConnection) {
    formGroupConnection.formGroupSubscription.unsubscribe();
    formGroupConnection.storeSubscription.unsubscribe();
  }
}
