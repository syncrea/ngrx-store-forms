export function noStoreError() {
  throw new Error(
    `No store detected. Make sure you've included ngrx Store on your main module.`
  );
}

export function noFormGroupError() {
  throw new Error(
    `rxfConnectForm needs to be placed on an element which also contains a formGroup directive.`
  );
}
