import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BindingDirective} from './binding.directive';
import {Store} from '@ngrx/store';
import {BindingService} from './binding.service';
import {StoreFormsConfig} from './model';
import {STORE_FORMS_CONFIG, _STORE_FORMS_CONFIG, STORE_FORMS_FEATURE} from './tokens';

export const defaultStoreFormsConfig: StoreFormsConfig = {
  bindingStrategy: 'ObserveStore'
};

export function configFactory(config?: StoreFormsConfig): StoreFormsConfig {
  return { ...defaultStoreFormsConfig, ...config };
}

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
  ]
})
export class StoreFormsModule {
  static forRoot(config?: StoreFormsConfig): ModuleWithProviders {
    return {
      ngModule: StoreFormsModule,
      providers: [{
        provide: _STORE_FORMS_CONFIG,
        useValue: config
      }, {
        provide: STORE_FORMS_CONFIG,
        useFactory: configFactory,
        deps: [_STORE_FORMS_CONFIG]
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
        provide: _STORE_FORMS_CONFIG,
        useValue: config
      }, {
        provide: STORE_FORMS_CONFIG,
        useFactory: configFactory,
        deps: [_STORE_FORMS_CONFIG]
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
