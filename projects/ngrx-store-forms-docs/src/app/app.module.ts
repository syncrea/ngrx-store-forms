import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StoreFormsModule, storeFormsMetaReducer, StoreFormsEffects} from 'ngrx-store-forms';
import {ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {SimpleFormContainerComponent} from './simple-form/simple-form-container.component';
import {SimpleFormComponent} from './simple-form/simple-form.component';
import {UserFormContainerComponent} from './user-form/user-form-container.component';
import {UserFormComponent} from './user-form/user-form.component';
import {EffectsModule} from '@ngrx/effects';
import {simpleFormReducer} from './simple-form/simple-form.reducer';
import {userFormReducer} from './user-form/user-form.reducer';
import {UserFormEffects} from './user-form/user-form.effects';
import {UserFormService} from './user-form/user-form.service';

@NgModule({
  declarations: [
    AppComponent,
    SimpleFormContainerComponent,
    SimpleFormComponent,
    UserFormContainerComponent,
    UserFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      simpleForm: simpleFormReducer,
      userForm: userFormReducer
    }, {
      metaReducers: [storeFormsMetaReducer]
    }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([
      StoreFormsEffects,
      UserFormEffects
    ]),
    StoreFormsModule.forRoot({
      bindingStrategy: 'ObserveStore',
      errorMessages: {
        simpleForm: {
          form: {
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
  providers: [
    UserFormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
