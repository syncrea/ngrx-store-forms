import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Action, Store, StoreModule} from '@ngrx/store';
import {FormGroupState} from './store-forms.model';
import {storeFormsMetaReducer} from './store-forms.reducer';
import {StoreFormsModule} from './store-forms.module';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {take} from 'rxjs/operators';
import {EffectsModule} from '@ngrx/effects';
import {StoreFormsEffects} from './store-forms.effects';
import {UpdateStoreFormAction, UpdateStoreFormStateAction} from './store-forms.actions';

describe('ngrx store forms', () => {

  describe('Simple form', () => {
    class SimpleFormTestUpdateAction implements Action {
      readonly type = 'FormArrayTestUpdateAction';

      constructor(public readonly name: string, public userName: string) {

      }
    }

    type SimpleFormTestActions = SimpleFormTestUpdateAction;

    interface SimpleFormTestState {
      form: FormGroupState;
    }

    function simpleFormTestReducer(state: SimpleFormTestState, action: SimpleFormTestActions) {
      switch (action.type) {
        case 'FormArrayTestUpdateAction':
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
            debounce: 0
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
      const nativeNameInput: HTMLInputElement = fixture.nativeElement.querySelector('#name');
      nativeNameInput.value = 'Bob';
      nativeNameInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch)
          .toHaveBeenCalledWith(
            new UpdateStoreFormStateAction('test.form', {
              value: {
                name: 'Bob',
                userName: ''
              },
              untouched: true,
              touched: false,
              pristine: false,
              dirty: true,
              valid: true,
              invalid: false,
              pending: false,
              errors: {}
            })
          );
      });
    }));

    it('should update name and userName in store on form fields input', async(() => {
      const nativeNameInput: HTMLInputElement = fixture.nativeElement.querySelector('#name');
      nativeNameInput.value = 'Bob';
      nativeNameInput.dispatchEvent(new Event('input'));

      const nativeUserNameInput: HTMLInputElement = fixture.nativeElement.querySelector('#userName');
      nativeUserNameInput.value = 'bob';
      nativeUserNameInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch)
          .toHaveBeenCalledWith(
            new UpdateStoreFormStateAction('test.form', {
              value: {
                name: 'Bob',
                userName: 'bob'
              },
              untouched: true,
              touched: false,
              pristine: false,
              dirty: true,
              valid: true,
              invalid: false,
              pending: false,
              errors: {}
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

      store.dispatch(new UpdateStoreFormAction('test.form', {
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

      store.dispatch(new UpdateStoreFormAction('test.form', {
        name: 'Bob'
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
  });

  describe('Form array', () => {
    class FormArrayTestUpdateAction implements Action {
      readonly type = 'FormArrayTestUpdateAction';

      constructor(public readonly index: number,
                  public readonly name: string,
                  public userName: string) {}
    }

    type FormArrayTestActions = FormArrayTestUpdateAction;

    interface FormArrayTestState {
      form: FormGroupState;
    }

    function formArrayTestReducer(state: FormArrayTestState = {
      form: {
        value: {
          items: []
        }
      }
    }, action: FormArrayTestActions) {
      switch (action.type) {
        case 'FormArrayTestUpdateAction':
          const items = [
            ...state.form.value['items']
          ];
          items[action.index] = {
            name: action.name,
            userName: action.userName
          };

          return {
            form: {
              value: {
                items
              }
            }
          };
      }

      return state;
    }

    @Component({
      selector: 'rxsf-form-array-test',
      template: `
        <form [formGroup]="formArrayTestFormGroup"
              rxsfBinding="test.form"
              novalidate>
          <div formArrayName="items">
            <div *ngFor="let item of formArrayTestFormGroup.get('items').controls; let i = index"
                 [formGroupName]="i" class="form-group-{{i}}">
              <input class="name" formControlName="name" type="text">
              <input class="user-name" formControlName="userName" type="text">
            </div>
          </div>
        </form>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    class FormArrayTestComponent {
      formArrayTestFormGroup: FormGroup;

      constructor() {
        this.formArrayTestFormGroup = fb.group({
          items: fb.array([
            fb.group({
              name: '',
              userName: ''
            }),
            fb.group({
              name: '',
              userName: ''
            })
          ])
        });
      }
    }

    let fixture: ComponentFixture<FormArrayTestComponent>;
    let component: FormArrayTestComponent;
    let store: Store<any>;
    let fb: FormBuilder;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          StoreModule.forRoot({
            test: formArrayTestReducer
          }, {
            metaReducers: [storeFormsMetaReducer]
          }),
          EffectsModule.forRoot([StoreFormsEffects]),
          StoreFormsModule.forRoot({
            debounce: 0
          })
        ],
        declarations: [
          FormArrayTestComponent
        ]
      });

      fb = TestBed.get(FormBuilder);

      store = TestBed.get(Store);
      spyOn(store, 'dispatch').and.callThrough();

      fixture = TestBed.createComponent(FormArrayTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should update name in store form array on form field input', async(() => {
      const nativeNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.form-group-0 .name');
      nativeNameInput.value = 'Bob';
      nativeNameInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch)
          .toHaveBeenCalledWith(
            new UpdateStoreFormStateAction('test.form', {
              value: {
                items: [{
                  name: 'Bob',
                  userName: ''
                }, {
                  name: '',
                  userName: ''
                }]
              },
              untouched: true,
              touched: false,
              pristine: false,
              dirty: true,
              valid: true,
              invalid: false,
              pending: false,
              errors: {}
            })
          );
      });
    }));

    it('should update specific form elements in form array using custom update action', async(() => {
      const nativeNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.form-group-1 .name');
      const nativeUserNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.form-group-1 .user-name');

      store.dispatch(new FormArrayTestUpdateAction(1, 'Bob', 'bob'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(nativeNameInput.value).toBe('Bob');
        expect(nativeUserNameInput.value).toBe('bob');
      });
    }));

    it('should update specific form elements in form array using UpdateStoreFormStateAction', async(() => {
      const nativeNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.form-group-1 .name');
      const nativeUserNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.form-group-1 .user-name');

      store.dispatch(new UpdateStoreFormAction('test.form', {
        items: [{
          name: '', userName: ''
        }, {
          name: 'Bob', userName: 'bob'
        }]
      }));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(nativeNameInput.value).toBe('Bob');
        expect(nativeUserNameInput.value).toBe('bob');
      });
    }));

    it('should update with dynamically added form array item', async(() => {
      const formArray = <FormArray>component.formArrayTestFormGroup.get('items');
      formArray.push(fb.group({
        name: 'Dynamic',
        userName: 'dynamic'
      }));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch)
          .toHaveBeenCalledWith(
            new UpdateStoreFormStateAction('test.form', {
              value: {
                items: [{
                  name: '',
                  userName: ''
                }, {
                  name: '',
                  userName: ''
                }, {
                  name: 'Dynamic',
                  userName: 'dynamic'
                }]
              },
              untouched: true,
              touched: false,
              pristine: true,
              dirty: false,
              valid: true,
              invalid: false,
              pending: false,
              errors: {}
            })
          );
      });
    }));

    it('should update with dynamically removed form array item', async(() => {
      const formArray = <FormArray>component.formArrayTestFormGroup.get('items');
      formArray.removeAt(0);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
            new UpdateStoreFormStateAction('test.form', {
              value: {
                items: [{
                  name: '',
                  userName: ''
                }]
              },
              untouched: true,
              touched: false,
              pristine: true,
              dirty: false,
              valid: true,
              invalid: false,
              pending: false,
              errors: {}
            })
          );
      });
    }));
  });
});
