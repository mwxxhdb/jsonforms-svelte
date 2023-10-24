import { layoutRenderers } from "./layout/index.js";
import { controlRenderers } from "./controls/index.js";

export const renderers = [...layoutRenderers, ...controlRenderers];