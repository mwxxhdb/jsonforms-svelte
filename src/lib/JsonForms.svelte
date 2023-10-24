<script lang="ts">
	import {
		Actions,
		Generate,
		configReducer,
		coreReducer,
		defaultErrorTranslator,
		defaultTranslator,
		i18nReducer,
		type CoreActions,
		type ErrorTranslator,
		type JsonFormsCellRendererRegistryEntry,
		type JsonFormsRendererRegistryEntry,
		type JsonFormsUISchemaRegistryEntry,
		type JsonSchema,
		type Translator,
		type UISchemaElement,
		type ValidationMode
	} from '@jsonforms/core';
	import type { ErrorObject } from 'ajv';
	import DispatchRenderer from './DispatchRenderer.svelte';
	import { provideDispatch, provideJsonforms } from './context.js';

	export let data: string | number | boolean | Array<any> | object;
	export let schema: JsonSchema | undefined = undefined;
	export let uischema: UISchemaElement | undefined = undefined;
	export let renderers: JsonFormsRendererRegistryEntry[];
	export let cells: JsonFormsCellRendererRegistryEntry[] = [];
	export let config: any = undefined;
	export let readonly: boolean = false;
	export let uischemas: JsonFormsUISchemaRegistryEntry[] = [];
	export let validationMode: ValidationMode = 'ValidateAndShow';
	export let ajv: any = undefined;
	export let locale: string = 'en';
	export let translate: Translator = defaultTranslator;
	export let translateError: ErrorTranslator = defaultErrorTranslator;
	export let additionalErrors: ErrorObject[] = [];

	const store = provideJsonforms({});

	$: generatorData = typeof data === 'object' ? data : {};
	$: schemaToUse = schema ?? Generate.jsonSchema(generatorData);
	$: uischemaToUse = uischema ?? Generate.uiSchema(schemaToUse);
	$: core = coreReducer(
		{ data, schema: schemaToUse, uischema: uischemaToUse },
		Actions.init(data, schemaToUse, uischemaToUse, {
			validationMode,
			ajv,
			additionalErrors
		})
	);
	$: cfg = configReducer(undefined, Actions.setConfig(config));
	$: i18n = i18nReducer(
		{ locale, translate, translateError },
		Actions.updateI18n(locale, translate, translateError)
	);

	$: jsonforms = {
		core,
		config: cfg,
		i18n,
		renderers,
		cells,
		uischemas,
		readonly,
		errors: []
	};

	$: store.set(jsonforms);

	//@ts-ignore
	provideDispatch((action: CoreActions) => {
		jsonforms = {
			...jsonforms,
			core: coreReducer(jsonforms.core, action)
		};
	});
</script>

<DispatchRenderer
	props={{ schema: jsonforms.core.schema, uischema: jsonforms.core.uischema, path: '' }}
/>
