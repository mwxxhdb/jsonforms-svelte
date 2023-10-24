<script lang="ts">
	import {
		mapStateToJsonFormsRendererProps,
		type JsonFormsRendererRegistryEntry,
		type UISchemaElement
	} from '@jsonforms/core';
	import maxBy from 'lodash/maxBy.js';
	import UnknownRenderer from './UnknownRenderer.svelte';
	import type { RendererProps } from './compositions.js';
	import { injectJsonforms } from './context.js';

	export let props: RendererProps<UISchemaElement>;

	const jsonforms = injectJsonforms();
	if (!jsonforms) throw "'jsonforms couldn't be injected. Are you within JSON Forms?";

	$: rawProps = mapStateToJsonFormsRendererProps({ jsonforms: $jsonforms }, props);

	$: testerContext = { rootSchema: rawProps.rootSchema, config: rawProps.config };
	$: schema = rawProps.schema ?? {};
	$: uischema = rawProps.uischema ?? { type: 'VerticalLayout' };
	$: renderer = maxBy(rawProps.renderers, (r: JsonFormsRendererRegistryEntry) =>
		r.tester(uischema, schema, testerContext)
	);
	$: determinedRenderer =
		renderer === undefined || renderer.tester(uischema, schema, testerContext) === -1
			? UnknownRenderer
			: renderer.renderer;
</script>

<svelte:component this={determinedRenderer} props={rawProps} />
