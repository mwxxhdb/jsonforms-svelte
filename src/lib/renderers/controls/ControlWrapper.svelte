<script lang="ts">
	import { isDescriptionHidden, computeLabel } from '@jsonforms/core';
	import type { Styles } from '$lib/renderers/styles.js';
	import type { Options } from '$lib/renderers/util/options.js';

	export let id: string;
	export let description: string | undefined = undefined;
	export let errors: string | undefined = undefined;
	export let label: string | undefined = undefined;
	export let appliedOptions: Options | undefined = undefined;
	export let visible: boolean = true;
	export let required: boolean = false;
	export let isFocused: boolean = false;
	export let styles: Styles;

	$: showDescription = !isDescriptionHidden(
		visible,
		description,
		isFocused,
		!!appliedOptions?.showUnfocusedDescription
	);
	$: computedLabel = computeLabel(label, required, !!appliedOptions?.hideRequiredAsterisk);
</script>

{#if visible}
	<div {id} class={styles.control.root}>
		<label for={id + '-input'} class={styles.control.label}>
			{computedLabel}
		</label>
		<div class={styles.control.wrapper}>
			<slot />
		</div>
		<div class={errors ? styles.control.error : styles.control.description}>
			{#if !!errors}
				{errors}
			{:else if showDescription}
				{description}
			{/if}
		</div>
	</div>
{/if}
