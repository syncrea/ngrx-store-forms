import { CustomUpdateAction } from './simple-form.actions';

export function simpleFormReducer(state: any = {form: {}}, action: CustomUpdateAction) {
  switch (action.type) {
    case 'CustomUpdateAction': {
      return {
        ...state,
        form: {
          ...state.form,
          value: {
            ...state.form.value,
            name: 'Custom reset'
          }
        }
      };
    }
  }

  return state;
}

