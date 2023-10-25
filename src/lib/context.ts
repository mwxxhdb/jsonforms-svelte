import type { ErrorTranslator, JsonFormsCellRendererRegistryEntry, JsonFormsRendererRegistryEntry, JsonSchema, Translator, UISchemaElement, ValidationMode } from "@jsonforms/core";
import type { ErrorObject } from "ajv";
import { getContext, setContext } from "svelte";
import { writable, type Readable, type Writable } from "svelte/store";

const dataKey = {};
const erorrsKey = {};

const jsonFormsKey = {};
export type JsonFormsContext = {
  schema: JsonSchema;
  uischema: UISchemaElement;
  renderers: JsonFormsRendererRegistryEntry[];
  cells: JsonFormsCellRendererRegistryEntry[];
  config: any;
  readonly: boolean;
  validationMode: ValidationMode;
  ajv: any;
  locale: string;
  translate: Translator;
  translateError: ErrorTranslator;
}

export type JsonFormsConfig = {
  /* [text] whether to restrict the number of characters to maxLength, if specified in the JSON schema */
  restrict: boolean;
  /* [text] whether to resize the input's width to maxLength, if specified in the JSON schema */
  trim: boolean;
  /* [text] if input descriptions should hide when not focused */
  showUnfocusedDescription: boolean;
  /* [text] if asterisks in labels for required fields should be hidden */
  hideRequiredAsterisk: boolean;
  [key: string]: any;
}

export function provideData(data: any): Writable<any> {
  const store = writable(data);
  setContext(dataKey, store);
  return store;
}
export function injectData(): Writable<any> {
  return getContext(dataKey);
}

export function provideErrors(errors: ErrorObject[]): Writable<ErrorObject[]> {
  const store = writable(errors);
  setContext(erorrsKey, errors);
  return store;
}
export function injectErrors(): Writable<ErrorObject[]> {
  return getContext(erorrsKey);
}

export function provideJsonForms(jsonForms: JsonFormsContext) {
  const store = writable(jsonForms);
  setContext(jsonFormsKey, { subscribe: store.subscribe });
  return store;
}
export function injectJsonForms(): Readable<JsonFormsContext> {
  return getContext(jsonFormsKey);
}

export const idStore = writable<string[]>([]);