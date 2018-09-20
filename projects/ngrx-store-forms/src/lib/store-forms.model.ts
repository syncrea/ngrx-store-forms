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

export type StoreFormsBindingStrategy = 'ObserveStore' | 'OnlyUpdateStoreFormAction';

export interface StoreFormsConfig {
  bindingStrategy?: StoreFormsBindingStrategy;
  errorMessages?: ErrorMessages;
}

export interface FormGroupState {
  value?: any;
  errors?: any;
  untouched?: boolean;
  touched?: boolean;
  pristine?: boolean;
  dirty?: boolean;
  valid?: boolean;
  invalid?: boolean;
  pending?: boolean;
}
