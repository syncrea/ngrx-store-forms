import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { filter, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { LoadUserFormAction, LoadUserFormSuccessAction } from './user-form.actions';
import { UserFormService } from './user-form.service';
import { UserForm } from './user-form.model';

@Injectable()
export class UserFormEffects {
  constructor(private actions: Actions, private userFormService: UserFormService) {}

  @Effect() loadUserForm = this.actions
    .pipe(
      filter((action: Action) => action instanceof LoadUserFormAction),
      switchMap((action: LoadUserFormAction) =>
        this.userFormService.loadUserForm()
          .pipe(
            map((userForm: UserForm) => new LoadUserFormSuccessAction(userForm))
          )
      )
    );
}
