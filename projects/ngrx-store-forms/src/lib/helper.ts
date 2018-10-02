import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {ErrorMessages} from './store-forms.model';
import {ResolvedErrorMessages} from "ngrx-store-forms/lib/store-forms.model";

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

export function getErrors(control: AbstractControl,
                          errorMessages: ErrorMessages,
                          pathPrefix: string[],
                          resolvedErrorMessages: ResolvedErrorMessages = {},
                          path: string[] = []): ResolvedErrorMessages {
  if (control instanceof FormGroup) {
    Object.keys(control.controls)
      .map(key => ({name: key, control: control.controls[key]}))
      .forEach(entry => getErrors(entry.control, errorMessages, pathPrefix, resolvedErrorMessages, [...path, entry.name]));
  } else if (control instanceof FormArray) {
    control.controls.forEach(
      (subControl, index) => getErrors(subControl, errorMessages, pathPrefix, resolvedErrorMessages, [...path, `${index}`])
    );
  } else {
    if (control.errors) {
      const initialPath = [...path];
      const lastPathElement = initialPath.pop();
      const err: ResolvedErrorMessages = <any>initialPath
        .reduce((errorsWalker, pathElement) => errorsWalker[pathElement] || (errorsWalker[pathElement] = {}), resolvedErrorMessages);
      const normalizedPath = path.filter(pathElement => !(/^\d+$/g.test(pathElement)));
      err[lastPathElement] = {
        validators: control.errors,
        messages: Object.keys(control.errors)
          .reduce((messages, validatorName) => {
            let resolvedMessage = deepGet(errorMessages, [...pathPrefix, ...normalizedPath, validatorName].join('.'));
            if (typeof resolvedMessage === 'object') {
              resolvedMessage = validatorName;
            }
            if (messages.indexOf(resolvedMessage) === -1) {
              messages.push(resolvedMessage);
            }
            return messages;
          }, [])
      };
    }
  }

  return resolvedErrorMessages;
}
