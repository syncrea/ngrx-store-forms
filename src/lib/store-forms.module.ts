import {Inject, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BindingDirective} from './binding.directive';
import {META_REDUCERS, MetaReducer, Store} from '@ngrx/store';
import {BindingService} from './binding.service';
import {StoreFormsConfig} from './model';
import {STORE_FORMS_CONFIG} from './tokens';

export const defaultStoreFormsConfig: StoreFormsConfig = {
  debounce: 300
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
  static configure(config?: StoreFormsConfig): ModuleWithProviders {
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
}
