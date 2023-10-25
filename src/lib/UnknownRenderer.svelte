<script lang="ts">
	import type { Scopable } from '@jsonforms/core';
	import type { RendererProps } from './compositions.js';

	export let props: RendererProps<Scopable>;
</script>

{#if props.uischema.scope}
	<div>No applicable renderer found for scope [{props.uischema.scope}].</div>
{:else}
	<div>No applicable renderer found.</div>
{/if}
