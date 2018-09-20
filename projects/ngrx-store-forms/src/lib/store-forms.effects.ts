import {Inject, Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {StoreFormsNoopAction, UpdateStoreFormAction, UpdateStoreFormStateAction} from './store-forms.actions';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {StoreFormsService} from './store-forms.service';
import {STORE_FORMS_CONFIG} from './tokens';
import {FormGroupState, StoreFormsConfig} from './store-forms.model';
import {deepGet} from './helper';
import {of, Observable} from 'rxjs';

@Injectable()
export class StoreFormsEffects {
  @Effect() reflectToFormStateEffect: Observable<Action> = this.actions
    .pipe(
      filter((action: Action) => action instanceof UpdateStoreFormAction),
      switchMap((action: UpdateStoreFormAction) => {
        if (this.config.bindingStrategy === 'ObserveStore') {
          return <any>this.store
            .pipe(
              take(1),
              map((state: any) => {
                const formState: FormGroupState = deepGet(state, action.path, true);
                return new UpdateStoreFormStateAction(action.path, {
                  ...formState,
                  value: {
                    ...formState.value,
                    ...action.value
                  }
                });
              })
            );
        } else {
          this.bindingService.updateFormGroup(action.path, action.value);
          return of(new StoreFormsNoopAction());
        }
      })
    );

  constructor(private actions: Actions,
              private bindingService: StoreFormsService,
              @Inject(STORE_FORMS_CONFIG) private config: StoreFormsConfig,
              private store: Store<any>) {

  }
}
