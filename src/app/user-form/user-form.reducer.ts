import { UserFormActions } from './user-form.actions';

export function userFormReducer(state: any = {userForm: {}}, action: UserFormActions) {
  switch (action.type) {
    case 'LoadUserFormSuccessAction': {
      return {
        ...state,
        userForm: {
          ...state.userForm,
          value: {
            ...action.userForm
          }
        }
      };
    }
  }

  return state;
}

