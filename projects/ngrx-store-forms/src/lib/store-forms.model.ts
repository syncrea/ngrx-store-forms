import {AbstractControl, FormGroup} from '@angular/forms';
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

export type ErrorResolver = (control: AbstractControl, path: string[]) => string[] | null;

export interface ResolvedErrorMessages {
  [k: string]: ResolvedErrorMessages | string[];
}

export type StoreFormsBindingStrategy = 'ObserveStore' | 'OnlyUpdateStoreFormAction';

export interface StoreFormsConfig {
  bindingStrategy?: StoreFormsBindingStrategy;
  errorMessages?: ErrorMessages;
  debounce?: number;
}

export interface FormControlStateBase {
  untouched: boolean;
  touched: boolean;
  pristine: boolean;
  dirty: boolean;
  valid: boolean;
  invalid: boolean;
  pending: boolean;
  disabled: boolean;
  enabled: boolean;
}

export type FormGroupValues<F> = {
  [k in keyof F]: FormGroupValues<F[k]> | string;
};

export type FormGroupFields<F> = {
  [k in keyof F]: FormGroupState<F[k]> | FormControlState;
};

export interface FormGroupState<F = any> extends FormControlStateBase {
  value: FormGroupValues<F>;
  errors?: string[];
  fields: FormGroupFields<F>;
}

export interface FormControlState extends FormControlStateBase {
  value: string;
  errors?: string[];
}
