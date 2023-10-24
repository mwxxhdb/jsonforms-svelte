<script lang="ts">
	import JsonForms from '$lib/JsonForms.svelte';
	import { renderers } from '$lib/renderers/index.js';

	let data = { name: 'zhangsan', age: 15 };
</script>

<JsonForms {data} {renderers} />

<hr />

<h1>Raw data</h1>
<input type="text" bind:value={data.name} />
<input type="number" bind:value={data.age} />
