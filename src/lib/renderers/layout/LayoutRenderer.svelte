<script lang="ts">
	import { isVisible, type RendererProps } from '$lib/compositions.js';
	import { injectData, injectJsonForms } from '$lib/context.js';
	import DispatchRenderer from '$lib/DispatchRenderer.svelte';
	import type { Layout } from '@jsonforms/core';
	import { useStyles } from '../styles.js';

	export let props: RendererProps<Layout>;

	const rootData = injectData();
	const jsonforms = injectJsonForms();

	$: visibleState = isVisible(props, $rootData, $jsonforms.ajv);

	$: styles = useStyles(props.uischema);
	$: direction = props.uischema.type === 'HorizontalLayout' ? 'row' : 'column';

	$: layoutClassObject = direction === 'row' ? styles.horizontalLayout : styles.verticalLayout;
</script>

{#if visibleState}
	<div class={layoutClassObject.root}>
		{#each props.uischema.elements as element}
			<div class={layoutClassObject.item}>
				<DispatchRenderer
					props={{
						...props,
						uischema: element
					}}
				/>
			</div>
		{/each}
	</div>
{/if}
