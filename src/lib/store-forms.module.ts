import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BindingDirective } from './binding.directive';
import { Store } from '@ngrx/store';
import { BindingService } from './binding.service';
import { StoreFormsConfig } from './model';
import { STORE_FORMS_CONFIG } from './tokens';

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
  static forFeature(feature: string, config?: StoreFormsConfig) {
    if (!!!config) {
      config = <StoreFormsConfig>{
        feature: feature
      };
    } else {
      config = Object.assign(config, { feature: feature });
    }

    return this.configure(config);
  }
  static configure(config?: StoreFormsConfig): ModuleWithProviders {
    return {
      ngModule: StoreFormsModule,
      providers: [
        {
          provide: STORE_FORMS_CONFIG,
          useValue: { ...defaultStoreFormsConfig, ...config }
        },
        {
          provide: BindingService,
          useClass: BindingService,
          deps: [STORE_FORMS_CONFIG, Store]
        }
      ]
    };
  }
}
