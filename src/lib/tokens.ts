import {InjectionToken} from '@angular/core';
import {StoreFormsConfig} from './model';

export const STORE_FORMS_CONFIG = new InjectionToken<StoreFormsConfig>('rxsf Config');
export const STORE_FORMS_FEATURE = new InjectionToken<string>('rxsf Feature');
