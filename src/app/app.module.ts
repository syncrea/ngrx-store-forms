import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StoreFormsModule } from '../lib/store-forms.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Action, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFormsMetaReducer } from '../lib/reducer';
import { Form1ContainerComponent } from './container/form1-container.component';
import { Form1Component } from './components/form1.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreFormsEffects } from '../lib/effects';
import { FormArrayComponent } from './components/form-array.component';

export function testFormReducer(state: any = { form1: {}, form2: { value: { items: [] } } }, action: Action) {
  switch (action.type) {
    case 'CustomUpdateAction': {
      return {
        ...state,
        form1: {
          ...state.form1,
          value: {
            ...state.form1.value,
            name: 'Custom reset'
          }
        }
      };
    }
    case 'AddFormArrayItemAction': {
      return {
        ...state,
        form2: {
          ...state.form2,
          value: {
            items: !!!state.form2.value.items ? [{}] : [...state.form2.value.items, {}]
          }
        }
      };
    }
  }

  return state;
}


@NgModule({
  declarations: [
    AppComponent,
    Form1ContainerComponent,
    Form1Component,
    FormArrayComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      testForm: testFormReducer
    }, {
        metaReducers: [storeFormsMetaReducer]
      }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([
      StoreFormsEffects
    ]),
    StoreFormsModule.configure({
      bindingStrategy: 'ObserveStore',
      errorMessages: {
        testForm: {
          form1: {
            name: {
              required: 'Name is required!'
            },
            userName: {
              required: 'User name is required!',
              userNameTaken: 'The user name is already taken!'
            }
          }
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
