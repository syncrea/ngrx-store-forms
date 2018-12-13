import {AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';
import {
  ErrorMessages,
  FormControlState,
  FormGroupFields,
  FormGroupState,
  ErrorResolver,
  FormGroupValues,
  StoreFormsConfig,
  FormControlStateBase
} from './store-forms.model';
import {defaultStoreFormsConfig} from './default-config';

export function deepGet(object: any, path: string, throwOnMiss = false): any {
  return path
    .split('.')
    .reduce((partialState, pathSegment) => {
      if (throwOnMiss && typeof partialState[pathSegment] !== 'object') {
        throw new Error(
          `Path '${path}' could not be resolved in object ${object}. Segment '${pathSegment}' was not referring to type object.`
        );
      }
      return partialState[pathSegment] || {};
    }, object);
}

export function getEffectiveConfig(userConfig: StoreFormsConfig) {
  return {...defaultStoreFormsConfig, ...userConfig};
}

export function deepEquals(x, y) {
  if (x === y) {
    return true; // if both x and y are null or undefined and exactly the same
  } else if (!(x instanceof Object) || !(y instanceof Object)) {
    return false; // if they are not strictly equal, they both need to be Objects
  } else if (x.constructor !== y.constructor) {
    // they must have the exact same prototype chain, the closest we can do is
    // test their constructor.
    return false;
  } else {
    for (const p in x) {
      if (!x.hasOwnProperty(p)) {
        continue; // other properties were tested using x.constructor === y.constructor
      }
      if (!y.hasOwnProperty(p)) {
        return false; // allows to compare x[ p ] and y[ p ] when set to undefined
      }
      if (x[p] === y[p]) {
        continue; // if they have the same strict value or identity then they are equal
      }
      if (typeof (x[p]) !== 'object') {
        return false; // Numbers, Strings, Functions, Booleans must be strictly equal
      }
      if (!deepEquals(x[p], y[p])) {
        return false;
      }
    }
    for (const p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  }
}

function extractStateBase(control: AbstractControl): FormControlStateBase {
  return {
    dirty: control.dirty,
    invalid: control.invalid,
    pending: control.pending,
    pristine: control.pristine,
    touched: control.touched,
    untouched: control.untouched,
    valid: control.valid,
    disabled: control.disabled,
    enabled: control.enabled
  };
}

// TODO: Handle form arrays correctly
export function getFormState<F>(control: AbstractControl,
                         errorResolver: ErrorResolver,
                         path: string[] = []): FormGroupState<F> | FormControlState {
  if (control instanceof FormGroup) {
    const fields: FormGroupFields<F> = Object.keys(control.controls)
      .map(key => ({
        name: key,
        state: getFormState(control.controls[key], errorResolver, [...path, key])
      }))
      .reduce((reducedFields: FormGroupFields<F>, entry) => {
        reducedFields[entry.name] = entry.state;
        return reducedFields;
      }, <FormGroupFields<F>>{});


    return <FormGroupState<F>>{
      ...extractStateBase(control),
      value: <FormGroupValues<F>>control.value,
      fields,
      errors: errorResolver(control, path)
    };
  } else {
    return <FormControlState>{
      ...extractStateBase(control),
      value: control.value,
      errors: errorResolver(control, path)
    };
  }
}

export function resolveErrors(errors: ValidationErrors,
                              path: string[],
                              errorMessages: ErrorMessages = {},
                              pathPrefix: string[] = []): string[] | null {
  if (!errors) {
    return null;
  }

  const normalizedPath = path.filter(pathElement => !(/^[\d\s]+$/g.test(pathElement)));
  return Object.keys(errors)
    .reduce((messages, validatorName) => {
      const wholePath = [...pathPrefix, ...normalizedPath];
      let resolvedMessage = deepGet(errorMessages, [...wholePath, validatorName].join('.'));
      if (typeof resolvedMessage === 'object') {
        const parentSearchPath = [...wholePath];
        while (typeof resolvedMessage === 'object' && parentSearchPath.length > 0) {
          parentSearchPath.pop();
          resolvedMessage = deepGet(errorMessages, [...parentSearchPath, validatorName].join('.'));
        }

        if (typeof resolvedMessage === 'object') {
          resolvedMessage = validatorName;
        }
      }
      if (messages.indexOf(resolvedMessage) === -1) {
        messages.push(resolvedMessage);
      }
      return messages;
    }, []);
}
