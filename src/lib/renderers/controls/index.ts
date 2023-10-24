import { rankWith, type JsonFormsRendererRegistryEntry, isStringControl } from "@jsonforms/core";
import StringControlRenderer from "./StringControlRenderer.svelte";

export const stringControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: StringControlRenderer,
  tester: rankWith(1, isStringControl)
};

export const controlRenderers = [stringControlRendererEntry];