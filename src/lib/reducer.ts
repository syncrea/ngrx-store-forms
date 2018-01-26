import {ActionReducer} from '@ngrx/store';
import {Action} from '@ngrx/store';
import {FormGroupState, FormStateUpdate} from './model';

export class UpdateFormStateAction implements Action {
  readonly type = 'UpdateFormStateAction';

  constructor(public readonly update: FormStateUpdate) {
  }
}

export function storeFormsReducer(state: any, action: UpdateFormStateAction): any {
  switch (action.type) {
    case 'UpdateFormStateAction': {
      const clone = Object.assign({}, state);
      const formState: FormGroupState = action.update.path
        .split('.')
        .reduce((partialState, pathSegment) => {
          return partialState[pathSegment] = Object.assign({}, partialState[pathSegment]);
        }, clone);

      Object.assign(formState, {
        ...action.update.state
      });

      if (action.update.state.value) {
        Object.assign(formState, {
          value: {
            ...formState.value,
            ...action.update.state.value
          }
        });
      }

      return clone;
    }
  }

  return state;
}

export function storeFormsMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state: any, action: UpdateFormStateAction): any {
    const updatedState = storeFormsReducer(state, action);
    return reducer(updatedState, action);
  };
}
