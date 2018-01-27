import {Inject, Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {StoreFormsNoopAction, UpdateStoreFormAction, UpdateStoreFormStateAction} from './reducer';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {BindingService} from './binding.service';
import {STORE_FORMS_CONFIG} from './tokens';
import {FormGroupState, StoreFormsBindingStrategy, StoreFormsConfig} from './model';
import {deepGet} from './helper';
import {of} from 'rxjs/observable/of';

@Injectable()
export class StoreFormsEffects {
  @Effect() reflectToFormStateEffect = this.actions
    .pipe(
      filter((action: Action) => action instanceof UpdateStoreFormAction),
      switchMap((action: UpdateStoreFormAction) => {
        if (this.config.bindingStrategy === 'ObserveStore') {
          return <any>this.store
            .pipe(
              take(1),
              map((state: any) => {
                const formState: FormGroupState = deepGet(state, action.path);
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
              private bindingService: BindingService,
              @Inject(STORE_FORMS_CONFIG) private config: StoreFormsConfig,
              private store: Store<any>) {

  }
}
