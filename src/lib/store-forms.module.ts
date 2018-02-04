import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BindingDirective} from './binding.directive';
import {Store} from '@ngrx/store';
import {BindingService} from './binding.service';
import {StoreFormsConfig} from './model';
import { STORE_FORMS_CONFIG, STORE_FORMS_FEATURE } from './tokens';

export const defaultStoreFormsConfig: StoreFormsConfig = {
  bindingStrategy: 'ObserveStore'
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    BindingDirective
  ],
  exports: [
    BindingDirective
  ],
  providers: [{
    provide: STORE_FORMS_CONFIG,
    useValue: defaultStoreFormsConfig
  }, {
    provide: BindingService,
    useClass: BindingService,
    deps: [STORE_FORMS_CONFIG, Store]
  }]
})
export class StoreFormsModule {
  static forRoot(config?: StoreFormsConfig): ModuleWithProviders {
    return {
      ngModule: StoreFormsModule,
      providers: [{
        provide: STORE_FORMS_CONFIG,
        useValue: {...defaultStoreFormsConfig, ...config}
      }, {
        provide: BindingService,
        useClass: BindingService,
        deps: [STORE_FORMS_CONFIG, Store]
      }]
    };
  }

  static forFeature(feature: string, config?: StoreFormsConfig): ModuleWithProviders {
    return {
      ngModule: StoreFormsModule,
      providers: [{
        provide: STORE_FORMS_CONFIG,
        useValue: {...defaultStoreFormsConfig, ...config}
      }, {
        provide: BindingService,
        useClass: BindingService,
        deps: [STORE_FORMS_CONFIG, Store, STORE_FORMS_FEATURE]
      }, {
        provide: STORE_FORMS_FEATURE,
        useValue: feature
      }]
    };
  }
}
