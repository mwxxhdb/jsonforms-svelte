<script lang="ts">
	import { isDisabled, isVisible, type RendererProps } from '$lib/compositions.js';
	import { injectData, injectJsonForms } from '$lib/context.js';
	import { isRequired } from '$lib/jsonFormsCompositions.js';
	import {
		composeWithUi,
		createId,
		createLabelDescriptionFrom,
		getCombinedErrorMessage,
		getI18nKey,
		removeId,
		Resolve,
		type ControlElement
	} from '@jsonforms/core';
	import merge from 'lodash/merge.js';
	import { onDestroy } from 'svelte';
	import { useStyles } from '../styles.js';
	import isEqual from 'lodash/isEqual.js';
	import ControlWrapper from './ControlWrapper.svelte';
	import fpSet from 'lodash/fp/set.js';
	import { paths } from 'lodash/fp.js';
	import type { ChangeEventHandler } from 'svelte/elements';

	export let props: RendererProps<ControlElement>;

	const id = createId(props.uischema.scope);
	const rootData = injectData();
	const jsonforms = injectJsonForms();
	const pathState = composeWithUi(props.uischema, props.path);
	$: resolvedSchema = Resolve.schema(props.schema, props.uischema.scope, $jsonforms.schema);
	$: rawProps = { ...props, path: pathState, schema: resolvedSchema };

	$: visibleState = isVisible(rawProps, $rootData, $jsonforms.ajv);
	$: required = isRequired(props.schema, props.uischema.scope, $jsonforms.schema);
	// TODO get errors
	// $: errors = getErrorAt(path, resolvedSchema)(state);
	$: description = resolvedSchema.description;
	$: data = Resolve.data($rootData, pathState);
	$: labelDesc = createLabelDescriptionFrom(props.uischema, resolvedSchema);
	$: label = labelDesc.show ? labelDesc.text : '';
	$: disabled = isDisabled(props, $rootData, $jsonforms);

	$: i18nLabel = $jsonforms.translate(
		getI18nKey(rawProps.schema, rawProps.uischema, rawProps.path, 'label'),
		label,
		{
			schema: rawProps.schema,
			uischema: rawProps.uischema,
			path: rawProps.path,
			// TODO errors
			errors: []
		}
	);
	$: i18nDescription = $jsonforms.translate(
		getI18nKey(rawProps.schema, rawProps.uischema, rawProps.path, 'description'),
		description,
		{
			schema: rawProps.schema,
			uischema: rawProps.uischema,
			path: rawProps.path,
			// TODO errors
			errors: []
		}
	);
	$: i18nErrorMessage = getCombinedErrorMessage(
		// TODO errors
		[],
		$jsonforms.translateError,
		$jsonforms.translate,
		rawProps.schema,
		rawProps.uischema,
		rawProps.path
	);

	let focused = false;
	$: styles = useStyles(props.uischema);
	onDestroy(() => removeId(id));

	$: appliedOptions = merge({}, $jsonforms.config, props.uischema.options);

	let value = '';
	$: if (!isEqual(value, data)) {
		value = data;
	}

	const onInput: ChangeEventHandler<HTMLInputElement> = (e) => {
		//@ts-ignore
		const newValue = e.target?.value;
		if (isEqual(newValue, value)) return;
		rootData.update((d) => fpSet(pathState, newValue, d));
	};
</script>

<ControlWrapper
	{id}
	description={i18nDescription}
	errors={i18nErrorMessage}
	label={i18nLabel}
	visible={visibleState}
	{appliedOptions}
	{required}
	isFocused={focused}
	{styles}
>
	<input
		{id}
		class={styles.control.input}
		{disabled}
		placeholder={appliedOptions.placeholder}
		{value}
		on:input={onInput}
		on:focus={() => (focused = true)}
		on:blur={() => (focused = false)}
	/>
</ControlWrapper>
