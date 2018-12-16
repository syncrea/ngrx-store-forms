import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Action, Store, StoreModule} from '@ngrx/store';
import {FormGroupState} from './store-forms.model';
import {storeFormsMetaReducer} from './store-forms.reducer';
import {StoreFormsModule} from './store-forms.module';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {take} from 'rxjs/operators';
import {EffectsModule} from '@ngrx/effects';
import {StoreFormsEffects} from './store-forms.effects';
import {UpdateStoreFormAction, UpdateStoreFormStateAction} from './store-forms.actions';
import {By, ɵgetDOM as getDOM} from '@angular/platform-browser';

export function dispatchEvent(element: any, eventType: any): void {
  getDOM().dispatchEvent(element, getDOM().createEvent(eventType));
}

export interface SimpleForm {
  name: string;
  userName: string;
}

describe('ngrx store forms', () => {

  describe('Simple form', () => {
    class SimpleFormTestUpdateAction implements Action {
      readonly type = 'SimpleFormTestUpdateAction';

      constructor(public readonly name: string, public userName: string) {

      }
    }

    type SimpleFormTestActions = SimpleFormTestUpdateAction;

    interface SimpleFormTestState {
      form: FormGroupState<SimpleForm>;
    }

    function simpleFormTestReducer(state: SimpleFormTestState = {form: {}}, action: SimpleFormTestActions) {
      switch (action.type) {
        case 'SimpleFormTestUpdateAction':
          return {
            form: {
              value: {
                name: action.name,
                userName: action.userName
              }
            }
          };
      }

      return state;
    }

    @Component({
      selector: 'rxsf-simple-form-test',
      template: `
        <form [formGroup]="simpleTestFormGroup"
              rxsfBinding="test.form"
              novalidate>
          <input id="name" formControlName="name" type="text">
          <input id="userName" formControlName="userName" type="text">
        </form>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    class SimpleFormTestComponent {
      simpleTestFormGroup: FormGroup;

      constructor(private fb: FormBuilder) {
        this.simpleTestFormGroup = fb.group({
          name: '',
          userName: ''
        });
      }
    }

    let fixture: ComponentFixture<SimpleFormTestComponent>;
    let component: SimpleFormTestComponent;
    let store: Store<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          StoreModule.forRoot({
            test: simpleFormTestReducer
          }, {
            metaReducers: [storeFormsMetaReducer]
          }),
          EffectsModule.forRoot([StoreFormsEffects]),
          StoreFormsModule.forRoot({
            debounce: 100
          })
        ],
        declarations: [
          SimpleFormTestComponent
        ]
      });

      store = TestBed.get(Store);
      spyOn(store, 'dispatch').and.callThrough();

      fixture = TestBed.createComponent(SimpleFormTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should update name in store on form field input', async(() => {
      const nameInput = fixture.debugElement.query(By.css('#name'));
      nameInput.nativeElement.value = 'Bob';
      nameInput.nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch)
          .toHaveBeenCalledWith(
            new UpdateStoreFormStateAction('test.form', {
              value: {
                name: 'Bob',
                userName: ''
              },
              dirty: true,
              invalid: false,
              pending: false,
              pristine: false,
              touched: false,
              untouched: true,
              valid: true,
              disabled: false,
              enabled: true,
              fields: {
                name: {
                  dirty: true,
                  invalid: false,
                  pending: false,
                  pristine: false,
                  touched: false,
                  untouched: true,
                  valid: true,
                  disabled: false,
                  enabled: true,
                  value: 'Bob',
                  errors: null
                },
                userName: {
                  dirty: false,
                  invalid: false,
                  pending: false,
                  pristine: true,
                  touched: false,
                  untouched: true,
                  valid: true,
                  disabled: false,
                  enabled: true,
                  value: '',
                  errors: null
                }
              },
              errors: null
            }));
      });
    }));

    it('should update name and userName in store on form fields input', async(() => {
      const nameInput = fixture.debugElement.query(By.css('#name'));
      nameInput.nativeElement.value = 'Bob';
      nameInput.nativeElement.dispatchEvent(new Event('input'));

      const userNameInput = fixture.debugElement.query(By.css('#userName'));
      userNameInput.nativeElement.value = 'bob';
      userNameInput.nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch)
          .toHaveBeenCalledWith(
            new UpdateStoreFormStateAction<SimpleForm>('test.form', {
              value: {
                name: 'Bob',
                userName: 'bob'
              },
              dirty: true,
              invalid: false,
              pending: false,
              pristine: false,
              touched: false,
              untouched: true,
              valid: true,
              disabled: false,
              enabled: true,
              fields: {
                name: {
                  dirty: true,
                  invalid: false,
                  pending: false,
                  pristine: false,
                  touched: false,
                  untouched: true,
                  valid: true,
                  disabled: false,
                  enabled: true,
                  value: 'Bob',
                  errors: null
                },
                userName: {
                  dirty: true,
                  invalid: false,
                  pending: false,
                  pristine: false,
                  touched: false,
                  untouched: true,
                  valid: true,
                  disabled: false,
                  enabled: true,
                  value: 'bob',
                  errors: null
                }
              },
              errors: null
            })
          );
      });
    }));

    it('should update form inputs on store changes with custom action', async(() => {
      const nativeNameInput: HTMLInputElement = fixture.nativeElement.querySelector('#name');
      const nativeUserNameInput: HTMLInputElement = fixture.nativeElement.querySelector('#userName');

      store.dispatch(new SimpleFormTestUpdateAction('Bob', 'bob'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(nativeNameInput.value).toBe('Bob');
        expect(nativeUserNameInput.value).toBe('bob');
      });
    }));

    it('should update form inputs on store changes with UpdateStoreFormAction', async(() => {
      const nativeNameInput: HTMLInputElement = fixture.nativeElement.querySelector('#name');
      const nativeUserNameInput: HTMLInputElement = fixture.nativeElement.querySelector('#userName');

      store.dispatch(new UpdateStoreFormAction<SimpleForm>('test.form', {
        name: 'Bob',
        userName: 'bob'
      }));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(nativeNameInput.value).toBe('Bob');
        expect(nativeUserNameInput.value).toBe('bob');
      });
    }));

    it('should update partial form inputs on store changes with UpdateStoreFormAction', async(() => {
      const nativeNameInput: HTMLInputElement = fixture.nativeElement.querySelector('#name');
      const nativeUserNameInput: HTMLInputElement = fixture.nativeElement.querySelector('#userName');

      store.dispatch(new UpdateStoreFormAction<SimpleForm>('test.form', {
        name: 'Bob',
        userName: ''
      }));

      component.simpleTestFormGroup.valueChanges
        .pipe(
          take(1)
        )
        .subscribe(() => {
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(nativeNameInput.value).toBe('Bob');
            expect(nativeUserNameInput.value).toBe('');
          });
        });
    }));

    it('should handle input field blur events and update touched state', async(() => {
      const nameInput = fixture.debugElement.query(By.css('#name'));
      nameInput.nativeElement.focus();
      nameInput.nativeElement.value = 'Bob';
      nameInput.nativeElement.dispatchEvent(new Event('input'));
      nameInput.nativeElement.dispatchEvent(new Event('blur'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch)
          .toHaveBeenCalledWith(
            new UpdateStoreFormStateAction<SimpleForm>('test.form', {
              value: {
                name: 'Bob',
                userName: ''
              },
              dirty: true,
              invalid: false,
              pending: false,
              pristine: false,
              // Since we blurred away from the first input, touched should be true
              touched: true,
              untouched: false,
              valid: true,
              disabled: false,
              enabled: true,
              fields: {
                name: {
                  dirty: true,
                  invalid: false,
                  pending: false,
                  pristine: false,
                  // Since we blurred away from the first input, touched should be true
                  touched: true,
                  untouched: false,
                  valid: true,
                  disabled: false,
                  enabled: true,
                  value: 'Bob',
                  errors: null
                },
                userName: {
                  dirty: false,
                  invalid: false,
                  pending: false,
                  pristine: true,
                  touched: false,
                  untouched: true,
                  valid: true,
                  disabled: false,
                  enabled: true,
                  value: '',
                  errors: null
                }
              },
              errors: null
            })
          );
      });
    }));
  });
});
