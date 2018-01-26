import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StoreFormsModule} from '../lib/store-forms.module';
import {ReactiveFormsModule} from '@angular/forms';
import {Action, StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {storeFormsMetaReducer} from '../lib/reducer';
import {Form1ContainerComponent} from './container/form1-container.component';
import {Form1Component} from './components/form1.component';

export function testFormReducer(state: any = {feature1: {state: {form1: {}}}}, action: Action) {
  return state;
}


@NgModule({
  declarations: [
    AppComponent,
    Form1ContainerComponent,
    Form1Component
  ],
  imports: [
    BrowserModule,
    StoreFormsModule.configure(),
    ReactiveFormsModule,
    StoreModule.forRoot({
      testForm: testFormReducer
    }, {
      metaReducers: [storeFormsMetaReducer]
    }),
    StoreDevtoolsModule.instrument()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
