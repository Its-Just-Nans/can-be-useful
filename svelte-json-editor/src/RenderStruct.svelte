<script>
	import Input from "./Input.svelte";
	export let valueProps = [];
	export let callback = null;
	const updateValue = (key, value) => {
		valueProps[key] = value;
		updateVal();
	};
	let newObjectInput = null;
	const addEntry = (newKey) => {
		if (Array.isArray(valueProps)) {
			valueProps.push("");
		} else {
			if (newKey !== null) {
				valueProps[newKey] = "";
				newObjectInput = null;
			}
		}
		updateVal();
	};
	const removeEntry = (tempIndex) => {
		if (Array.isArray(valueProps)) {
			if (tempIndex > -1) {
				valueProps.splice(tempIndex, 1);
			}
		} else {
			delete valueProps[tempIndex];
		}
		updateVal();
	};
	const updateVal = () => {
		if (callback !== null) {
			callback(valueProps);
		}
	};
</script>

<div>
	{#if Array.isArray(valueProps)}
		<ul class="border">
			{#each valueProps as value, index}
				<li>
					<p class="nameClass">{`index:${index}`}</p>
					<button
						on:click={() => {
							removeEntry(index);
						}}
					>
						-
					</button>
					<Input callBack={updateValue} {index} {value} />
				</li>
			{/each}
			<button
				on:click={() => {
					addEntry();
				}}
			>
				Add en entry
			</button>
		</ul>
	{:else if typeof valueProps === "object"}
		<ul class="border">
			{#each Object.entries(valueProps) as [key, value]}
				<li>
					<p class="nameClass">{key}</p>
					<button
						on:click={() => {
							removeEntry(key);
						}}
					>
						-
					</button>
					<Input callBack={updateValue} index={key} {value} />
				</li>
			{/each}
			<li>
				<input bind:value={newObjectInput} />
				<button
					on:click={() => {
						addEntry(newObjectInput);
					}}
				>
					Add en entry
				</button>
			</li>
		</ul>
	{/if}
</div>

<style>
	.border {
		border: 1px solid black;
		border-radius: 5px;
	}
	.nameClass {
		display: inline;
	}
</style>
