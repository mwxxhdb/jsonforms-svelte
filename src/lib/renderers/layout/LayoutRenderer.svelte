<script lang="ts">
	import DispatchRenderer from '$lib/DispatchRenderer.svelte';
	import { injectJsonforms } from '$lib/context.js';
	import type { LayoutProps } from '$lib/jsonFormsCompositions.js';
	import { mapStateToLayoutProps, type Layout } from '@jsonforms/core';
	import { useStyles } from '../styles.js';

	export let props: LayoutProps;

	const jsonforms = injectJsonforms();

	$: layout = { ...props, ...mapStateToLayoutProps({ jsonforms: $jsonforms }, props) };
	$: elements = (layout.uischema as Layout).elements;
	$: styles = useStyles(layout.uischema);

	$: layoutClassObject =
		layout.direction === 'row' ? styles.horizontalLayout : styles.verticalLayout;
</script>

{#if layout.visible}
	<div class={layoutClassObject.root}>
		{#each elements as element}
			<div class={layoutClassObject.item}>
				<DispatchRenderer
					props={{
						schema: layout.schema,
						uischema: element,
						path: layout.path,
						enabled: layout.enabled,
						renderers: layout.renderers,
						cells: layout.cells
					}}
				/>
			</div>
		{/each}
	</div>
{/if}
