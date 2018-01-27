import {ActionReducer} from '@ngrx/store';
import {Action} from '@ngrx/store';
import {FormGroupState} from './model';

export class UpdateStoreFormStateAction implements Action {
  readonly type = 'UpdateStoreFormStateAction';

  constructor(public readonly path: string,
              public readonly formState: FormGroupState) {
  }
}

export class UpdateStoreFormAction implements Action {
  readonly type = 'UpdateStoreFormAction';

  constructor(public readonly path: string,
              public readonly value: {[k: string]: string}) {
  }
}

export class StoreFormsNoopAction implements Action {
  readonly type = 'StoreFormsNoopAction';
}

export function storeFormsReducer(state: any, action: UpdateStoreFormStateAction): any {
  switch (action.type) {
    case 'UpdateStoreFormStateAction': {
      const clone = Object.assign({}, state);
      const formState: FormGroupState = action.path
        .split('.')
        .reduce((partialState, pathSegment) => {
          return partialState[pathSegment] = Object.assign({}, partialState[pathSegment]);
        }, clone);

      Object.assign(formState, {
        ...action.formState
      });

      if (action.formState.value) {
        Object.assign(formState, {
          value: {
            ...formState.value,
            ...action.formState.value
          }
        });
      }

      return clone;
    }
  }

  return state;
}

export function storeFormsMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state: any, action: UpdateStoreFormStateAction): any {
    const updatedState = storeFormsReducer(state, action);
    return reducer(updatedState, action);
  };
}
