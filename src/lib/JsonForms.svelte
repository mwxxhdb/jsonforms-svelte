<script lang="ts">
	import {
		Generate,
		defaultErrorTranslator,
		defaultTranslator,
		validate,
		type ErrorTranslator,
		type JsonFormsCellRendererRegistryEntry,
		type JsonFormsRendererRegistryEntry,
		type JsonSchema,
		type Translator,
		type UISchemaElement,
		type ValidationMode
	} from '@jsonforms/core';
	import type { ErrorObject } from 'ajv';
	import Ajv from 'ajv';
	import isEqual from 'lodash/isEqual.js';
	import DispatchRenderer from './DispatchRenderer.svelte';
	import { provideData, provideErrors, provideJsonForms, type JsonFormsConfig } from './context.js';

	export let data: string | number | boolean | Array<any> | object;
	export let schema: JsonSchema = Generate.jsonSchema(typeof data === 'object' ? data : {});
	export let uischema: UISchemaElement = Generate.uiSchema(schema);
	export let renderers: JsonFormsRendererRegistryEntry[];
	export let cells: JsonFormsCellRendererRegistryEntry[] = [];
	export let config: JsonFormsConfig = {
		restrict: false,
		trim: false,
		showUnfocusedDescription: false,
		hideRequiredAsterisk: false
	};
	export let readonly: boolean = false;
	export let validationMode: ValidationMode = 'ValidateAndShow';
	//@ts-ignore
	export let ajv: any = new Ajv();
	export let locale: string = 'en';
	export let translate: Translator = defaultTranslator;
	export let translateError: ErrorTranslator = defaultErrorTranslator;
	export let errors: ErrorObject[] =
		validationMode === 'NoValidation' ? [] : validate(ajv.compile(schema), data);

	const dataStore = provideData(data);
	$: dataStore.set(data);
	dataStore.subscribe((d) => {
		if (!isEqual(d, data)) data = d;
	});

	const errorsStore = provideErrors(errors);
	$: errorsStore.set(errors);
	errorsStore.subscribe((d) => {
		if (!isEqual(d, errors)) errors = d;
	});

	const jsonforms = provideJsonForms({
		schema,
		uischema,
		renderers,
		cells,
		config,
		readonly,
		validationMode,
		ajv,
		locale,
		translate,
		translateError
	});

	$: jsonforms.set({
		schema,
		uischema,
		renderers,
		cells,
		config,
		readonly,
		validationMode,
		ajv,
		locale,
		translate,
		translateError
	});
</script>

<DispatchRenderer props={{ schema, uischema, path: '', enabled: true }} />
