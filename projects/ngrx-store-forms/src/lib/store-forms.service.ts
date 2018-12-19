import {AbstractControl, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {filter, map} from 'rxjs/operators';
import {Inject, Injectable, Optional} from '@angular/core';
import {noStoreError, noStoreFormBinding} from './errors';
import {STORE_FORMS_CONFIG, STORE_FORMS_FEATURE} from './tokens';
import {FormGroupState, StoreFormBinding, StoreFormsConfig} from './store-forms.model';
import {deepEquals, deepGet, getEffectiveConfig, getFormState, resolveErrors} from './helper';
import {UpdateStoreFormStateAction} from './store-forms.actions';
import {merge, Subject} from 'rxjs';
import {debounceTime, skip} from 'rxjs/operators';

@Injectable()
export class StoreFormsService {
  private bindings: {[k: string]: StoreFormBinding} = {};
  private pathPrefix = '';
  private config: StoreFormsConfig;

  constructor(@Inject(STORE_FORMS_CONFIG) config: StoreFormsConfig,
              @Optional() private store: Store<any>,
              @Inject(STORE_FORMS_FEATURE) @Optional() private feature: string) {
    this.config = getEffectiveConfig(config);

    if (!this.store) {
      noStoreError();
    }

    if (this.feature) {
      this.pathPrefix = `${feature}.`;
    }
  }

  bind(path: string, formGroup: FormGroup) {
    const stateUpdateTrigger = new Subject<never>();

    const pathWithPrefix = `${this.pathPrefix}${path}`;
    let observeStore = true;
    let source = merge(formGroup.valueChanges, formGroup.statusChanges, stateUpdateTrigger);
    if (this.config.debounce) {
      source = source.pipe(debounceTime(this.config.debounce));
    }

    const errorResolver = (control: AbstractControl, controlPath: string[]) =>
      resolveErrors(
        control.errors,
        controlPath,
        this.config.errorMessages,
        pathWithPrefix.split('.')
      );

    const formGroupSubscription = source.subscribe(() => {
      observeStore = false;
      this.store.dispatch(new UpdateStoreFormStateAction(pathWithPrefix, <FormGroupState>getFormState(formGroup, errorResolver)));
      observeStore = true;
    });

    this.bindings[pathWithPrefix] = {
      path: pathWithPrefix,
      formGroup,
      formGroupSubscription,
      stateUpdateTrigger
    };

    if (this.config.bindingStrategy === 'ObserveStore') {
      this.bindings[pathWithPrefix].storeSubscription = this.store
        .pipe(
          // We skip the initial value emitted by the store subject
          skip(1),
          map((state) => deepGet(state, pathWithPrefix)),
          filter(() => observeStore),
          filter((formState: FormGroupState) => {
            // Very simple dirty checking by comparing current values in
            // state to values in form group using deep equal to prevent
            // unwanted infinite loop
            return formState.value && Object.keys(formState.value).length && !deepEquals(formState, getFormState(formGroup, errorResolver));
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

  findBinding(path: string): StoreFormBinding | null {
    const pathWithPrefix = `${this.pathPrefix}${path}`;
    return this.bindings[pathWithPrefix] || null;
  }

  getFormGroup(path: string) {
    const binding = this.findBinding(path);
    if (binding) {
      return binding;
    } else {
      noStoreFormBinding(`${this.pathPrefix}${path}`);
    }
  }

  triggerUpdate(path: string) {
    const binding = this.findBinding(path);
    if (binding) {
      binding.stateUpdateTrigger.next();
    } else {
      noStoreFormBinding(`${this.pathPrefix}${path}`);
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
