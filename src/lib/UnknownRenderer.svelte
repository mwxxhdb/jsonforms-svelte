<script lang="ts">
	export let props: RendererProps<UISchemaElement>;
	$: console.log(props);
</script>

{#if props.uischema.scope}
	<div>No applicable renderer found for scope [{props.uischema.scope}].</div>
{:else}
	<div>No applicable renderer found.</div>
{/if}
