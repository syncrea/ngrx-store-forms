import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {concatMap, delay, filter, map} from 'rxjs/operators';
import {Action} from '@ngrx/store';
import {LoadUserFormAction, LoadUserFormSuccessAction} from './user-form.actions';
import {UserFormService} from './user-form.service';
import {UserForm} from './user-form.model';
import {StoreFormsService} from 'ngrx-store-forms';

@Injectable()
export class UserFormEffects {
  constructor(private actions: Actions, private userFormService: UserFormService) {}

  @Effect() loadUserForm = this.actions
    .pipe(
      filter((action: Action) => action instanceof LoadUserFormAction),
      concatMap((action: LoadUserFormAction) =>
        this.userFormService.loadUserForm()
          .pipe(
            delay(2000),
            map((userForm: UserForm) => new LoadUserFormSuccessAction(userForm))
          )
      )
    );
}
