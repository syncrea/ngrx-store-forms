import {Action} from '@ngrx/store';
import {UserForm} from './user-form.model';

export class LoadUserFormAction implements Action {
  readonly type = 'LoadUserFormAction';
}

export class LoadUserFormSuccessAction implements Action {
  readonly type = 'LoadUserFormSuccessAction';
  constructor(public readonly userForm: UserForm) {}
}

export type UserFormActions = LoadUserFormAction | LoadUserFormSuccessAction;
