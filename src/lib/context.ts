import type { CoreActions, Dispatch, JsonFormsSubStates } from "@jsonforms/core";
import { getContext, setContext } from "svelte";
import { writable, type Readable, type Writable } from "svelte/store";

const key = {};
export function provideJsonforms(jsonforms: JsonFormsSubStates): Writable<JsonFormsSubStates> {
  const store = writable(jsonforms);
  setContext(key, { subscribe: store.subscribe });
  return store;
}
export function injectJsonforms(): Readable<JsonFormsSubStates> {
  return getContext(key);
}

const dispatchKey = {};
export function provideDispatch(dispatch: Dispatch<CoreActions>) {
  setContext(dispatchKey, dispatch);
}
export function injectDispatch(): Dispatch<CoreActions> {
  return getContext(dispatchKey);
}