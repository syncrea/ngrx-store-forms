import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {UserForm} from './user-form.model';
import {delay} from 'rxjs/operators';

@Injectable()
export class UserFormService {
  loadUserForm(): Observable<UserForm> {
    return of({
      userName: 'user-1',
      name: 'User 1',
      addresses: [{
        street: 'User street 1',
        city: 'City 1',
        postalCode: '11111',
        country: 'Country 1'
      }, {
        street: 'User street 2',
        city: 'City 2',
        postalCode: '22222',
        country: 'Country 2'
      }]
    }).pipe(delay(3000));
  }
}
