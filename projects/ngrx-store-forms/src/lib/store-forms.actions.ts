import {Action} from '@ngrx/store';
import {FormGroupState} from './store-forms.model';

export class UpdateStoreFormStateAction implements Action {
  readonly type = 'UpdateStoreFormStateAction';

  constructor(public readonly path: string,
              public readonly formState: FormGroupState) {
  }
}

export class UpdateStoreFormAction implements Action {
  readonly type = 'UpdateStoreFormAction';

  constructor(public readonly path: string,
              public readonly value: any) {
  }
}

export class StoreFormsNoopAction implements Action {
  readonly type = 'StoreFormsNoopAction';
}
