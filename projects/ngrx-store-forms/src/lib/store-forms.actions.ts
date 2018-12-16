import {Action} from '@ngrx/store';
import {FormGroupState} from './store-forms.model';

export class UpdateStoreFormStateAction<F = any> implements Action {
  readonly type = 'UpdateStoreFormStateAction';

  constructor(public readonly path: string,
              public readonly formState: FormGroupState<F>) {
  }
}

export class UpdateStoreFormAction<F = any> implements Action {
  readonly type = 'UpdateStoreFormAction';

  constructor(public readonly path: string,
              public readonly value: F) {
  }
}

export class StoreFormsNoopAction implements Action {
  readonly type = 'StoreFormsNoopAction';
}
