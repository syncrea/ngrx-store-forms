# ngrx store forms

![Travis build status](https://travis-ci.org/syncrea/ngrx-store-forms.svg?branch=master "Travis build")

Simple adapter with bindings between @angular/reactive-forms and @ngrx/store.

# Examples

## Adding ngrx-store-forms to your root module

You'll need to do three things to add ngrx-store-forms to your existing project:
1. Import the module
2. Add the meta reducer
3. Register the side effects

Import the module using `StoreFormsModule.forRoot()` within the imports section of your
root module. You also need to add `storeFormsMetaReducer` meta reducer to the 
`StoreModule` configuration object. As a last step, use the ngrx `EffectsModule` to register
the `StoreFormsEffects` side effects.

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    StoreModule.forRoot({...}, {
      metaReducers: [storeFormsMetaReducer]
    }),
    EffectsModule.forRoot([
      StoreFormsEffects
    ]),
    StoreFormsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Adding ngrx-store-forms to your feature module

```typescript
@NgModule({
  declarations: [FeatureComponent],
  imports: [
    CommonsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('coolFeature', {...}, {
      metaReducers: [storeFormsMetaReducer]
    }),
    EffectsModule.forFeature([
      StoreFormsEffects
    ]),
    StoreFormsModule.forFeature('coolFeature')
  ],
  providers: [],
  bootstrap: [FeatureComponent]
})
export class FeatureModule {
}
```

## Bind your form group to ngrx-store within your view

You can use the `rxsfBinding` directive to bind your form group to the store.

```html
<form [formGroup]="formGroup"
      rxsfBinding="subState.form"
      novalidate>
  <input formControlName="name">
  <input formControlName="userName">
</form>
```

That's it! After this change ngrx-store-forms will dispatch `UpdateStoreFormStateAction` actions when 
your reactive form has changed. A object of type `FormGroupState` will be written into 
your store at the location specified within the `rxsfBinding` directive.

## Configuration

Here's a short description of the different configuration properties you can pass to the ngrx store forms
module factories followed by a few configuration examples.

- *`bindingStrategy: StoreFormsBindingStrategy`* - Pass a reverse binding strategy for the ngrx store forms module. This is the
strategy that specifies how data from your store will be synchronized back into your form elements. The default `ObserveStore` strategy
observes state changes and performs a deep comparison of your ngrx state and form state and synchronizes if required.
- *`errorMessages: ErrorMessages`* - Specify an `ErrorMessages` object which contains all translations for your error messages. Please refer to the below example for more details.
- *`debounce: number`* - Debounce time when input changes on bound form elements are detected. This time in milli seconds is debouncing and thereby also delaying the reflection of 
form user input into your state. The default value is `200`. Using a value of `0` disables debouncing completely and the value reflection will be synchronous.

### Full configuration example

The following example shows a module using the FormStoreModule with all available configuration properties.

```javascript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      stateSlice1: simpleFormReducer
    }, {
      metaReducers: [storeFormsMetaReducer]
    }),
    EffectsModule.forRoot([
      StoreFormsEffects
    ]),
    StoreFormsModule.forRoot({
      bindingStrategy: 'ObserveStore',
      debounce: 300,
      errorMessages: {
        stateSlice1: {
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
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

# WIP / Open tasks
1. Documentation
2. Separate example app from library project
