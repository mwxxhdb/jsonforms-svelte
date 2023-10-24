<script lang="ts">
	import { useJsonFormsControl } from '$lib/jsonFormsCompositions.js';
	import { useVanillaControl, type RendererProps } from '$lib/compositions.js';
	import { injectDispatch, injectJsonforms } from '$lib/context.js';
	import type { ControlElement } from '@jsonforms/core';
	import ControlWrapper from './ControlWrapper.svelte';

	export let props: RendererProps<ControlElement>;

	const jsonforms = injectJsonforms();
	const dispatch = injectDispatch();
	let focused = false;
	$: control = useVanillaControl(
		useJsonFormsControl(props, $jsonforms, dispatch),
		(target) => target.value || undefined
	);
	$: focused = control.isFocused;
</script>

<ControlWrapper
	{...control.controlWrapper}
	styles={control.styles}
	isFocused={focused}
	appliedOptions={control.appliedOptions}
>
	<input
		class={control.styles.control.input}
		value={control.control.data}
		disabled={!control.control.enabled}
		autofocus={control.appliedOptions.focus}
		placeholder={control.appliedOptions.placeholder}
		on:change={control.onChange}
		on:focus={() => (focused = true)}
		on:blur={() => (focused = false)}
	/>
</ControlWrapper>
