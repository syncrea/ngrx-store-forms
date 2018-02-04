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

# WIP / Open tasks
1. Documentation
2. Separate example app from library project
