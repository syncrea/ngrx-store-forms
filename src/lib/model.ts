import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

export interface FormGroupConnection {
  formGroup: FormGroup;
  formGroupSubscription: Subscription;
  storeSubscription: Subscription;
}

export interface ErrorMessages {
  [k: string]: ErrorMessages | string;
}

export interface StoreFormsConfig {
  debounce?: number;
  errorMessages?: ErrorMessages;
}

export interface FormGroupState {
  value?: any;
  errors?: any;
  valid?: boolean;
  dirty?: boolean;
  updating?: boolean;
}

export interface FormStateUpdate {
  path: string;
  state: FormGroupState;
}
