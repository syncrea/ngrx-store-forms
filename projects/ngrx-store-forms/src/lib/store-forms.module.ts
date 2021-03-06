import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BindingDirective} from './binding.directive';
import {Store} from '@ngrx/store';
import {StoreFormsService} from './store-forms.service';
import {StoreFormsConfig} from './store-forms.model';
import {STORE_FORMS_CONFIG, STORE_FORMS_FEATURE} from './tokens';
import {defaultStoreFormsConfig} from './default-config';
import {TouchedUpdateDirective} from './touched-update.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    BindingDirective,
    TouchedUpdateDirective
  ],
  exports: [
    BindingDirective,
    TouchedUpdateDirective
  ],
  providers: [{
    provide: STORE_FORMS_CONFIG,
    useValue: defaultStoreFormsConfig
  }, {
    provide: StoreFormsService,
    useClass: StoreFormsService,
    deps: [STORE_FORMS_CONFIG, Store]
  }]
})
export class StoreFormsModule {
  static forRoot(config?: StoreFormsConfig): ModuleWithProviders {
    return {
      ngModule: StoreFormsModule,
      providers: [{
        provide: STORE_FORMS_CONFIG,
        useValue: config
      }, {
        provide: StoreFormsService,
        useClass: StoreFormsService,
        deps: [STORE_FORMS_CONFIG, Store]
      }]
    };
  }

  static forFeature(feature: string, config?: StoreFormsConfig): ModuleWithProviders {
    return {
      ngModule: StoreFormsModule,
      providers: [{
        provide: STORE_FORMS_CONFIG,
        useValue: config
      }, {
        provide: StoreFormsService,
        useClass: StoreFormsService,
        deps: [STORE_FORMS_CONFIG, Store, STORE_FORMS_FEATURE]
      }, {
        provide: STORE_FORMS_FEATURE,
        useValue: feature
      }]
    };
  }
}
