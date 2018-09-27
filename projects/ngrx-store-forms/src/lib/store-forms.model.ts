import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

export interface StoreFormBinding {
  path: string;
  formGroup: FormGroup;
  formGroupSubscription: Subscription;
  storeSubscription?: Subscription | undefined;
}

export interface ErrorMessages {
  [k: string]: ErrorMessages | string;
}

export interface ResolvedErrorMessage {
  messages: string[];
  validators: { [k: string]: boolean };
}

export interface ResolvedErrorMessages {
  [k: string]: ResolvedErrorMessages | ResolvedErrorMessage;
}

export type StoreFormsBindingStrategy = 'ObserveStore' | 'OnlyUpdateStoreFormAction';

export interface StoreFormsConfig {
  bindingStrategy?: StoreFormsBindingStrategy;
  errorMessages?: ErrorMessages;
  debounce?: number;
}

export interface FormGroupState {
  value?: { [k: string]: any } | FormGroupState | FormGroupState[];
  errors?: ResolvedErrorMessages;
  untouched?: boolean;
  touched?: boolean;
  pristine?: boolean;
  dirty?: boolean;
  valid?: boolean;
  invalid?: boolean;
  pending?: boolean;
}
