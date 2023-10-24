import { isLayout, rankWith, type JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import LayoutRenderer from './LayoutRenderer.svelte';

const layoutRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: LayoutRenderer,
  tester: rankWith(1, isLayout)
}

export const layoutRenderers = [layoutRendererEntry];
export { LayoutRenderer };

