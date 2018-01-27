export function noStoreError() {
  throw new Error(
    `No store detected. Make sure you've included @ngrx/store in your application.`
  );
}

export function noEffectsError() {
  throw new Error(
    `No store effects detected. Make sure you've included @ngrx/effects in your application.`
  );
}

export function noFormGroupError() {
  throw new Error(
    `rxfConnectForm needs to be placed on an element which also contains a formGroup directive.`
  );
}

export function noStoreFormBinding(path: string) {
  throw new Error(
    `No binding found for form state on path '${path}'.`
  );
}
