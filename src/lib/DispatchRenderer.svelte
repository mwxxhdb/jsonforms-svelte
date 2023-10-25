<script lang="ts">
	import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
	import maxBy from 'lodash/maxBy.js';
	import UnknownRenderer from './UnknownRenderer.svelte';
	import type { RendererProps } from './compositions.js';
	import { injectJsonForms } from './context.js';

	export let props: RendererProps;

	const jsonforms = injectJsonForms();
	if (!jsonforms) throw "'jsonforms couldn't be injected. Are you within JSON Forms?";

	$: testerContext = { rootSchema: $jsonforms.schema, config: $jsonforms.config };
	$: renderer = maxBy($jsonforms.renderers, (r: JsonFormsRendererRegistryEntry) =>
		r.tester(props.uischema, props.schema, testerContext)
	);
	$: determinedRenderer =
		renderer === undefined || renderer.tester(props.uischema, props.schema, testerContext) === -1
			? UnknownRenderer
			: renderer.renderer;
</script>

<svelte:component this={determinedRenderer} {props} />
