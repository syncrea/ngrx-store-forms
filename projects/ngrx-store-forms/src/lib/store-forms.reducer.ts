import { ActionReducer } from '@ngrx/store';
import { FormGroupState } from './store-forms.model';
import { UpdateStoreFormStateAction } from './store-forms.actions';

export function storeFormsReducer(state: any, action: UpdateStoreFormStateAction): any {
  switch (action.type) {
    case 'UpdateStoreFormStateAction': {
      const clone = Object.assign({}, state);
      const formState: FormGroupState = <any>action.path
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
