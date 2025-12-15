<script>
	import RenderStruct from "./RenderStruct.svelte";
	let files;
	$: reactiveParsed = JSON.stringify(parsed, null, 4);
	let parsed = null;
	const parsefiles = async () => {
		try {
			if (files) {
				const parseFile = (fileToParse) => {
					return new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = function (evt) {
							if (evt?.target?.result) {
								resolve(evt.target.result);
							} else {
								reject("No VALUE");
							}
						};
						reader.readAsText(fileToParse);
					});
				};
				const fileInString = await parseFile(files[0]);
				parsed = JSON.parse(fileInString);
			}
		} catch (e) {
			debugger;
			console.log(e);
		}
	};
	const updater = (newParsed) => {
		parsed = newParsed;
	};
	const download = () => {
		// https://stackoverflow.com/a/33542499
		try {
			const blob = new Blob([JSON.stringify(parsed)], {
				type: "application/json",
			});
			const elem = window.document.createElement("a");
			elem.href = window.URL.createObjectURL(blob);
			elem.download = "data.json";
			document.body.appendChild(elem);
			elem.click();
			document.body.removeChild(elem);
		} catch (e) {
			console.log(e);
			console.log("Error during download");
		}
	};
</script>

<main>
	<h1 class="center">JSON-EDITOR</h1>
	{#if parsed === null}
		<div class="center">
			<input
				type="file"
				bind:files
				on:change={() => {
					parsefiles();
				}}
			/><br />
			<button
				on:click={() => {
					parsed = [];
				}}
			>
				New Array
			</button>
			<button
				on:click={() => {
					parsed = {};
				}}
			>
				New Object
			</button>
		</div>
	{:else}
		<div class="center">
			<button
				on:click={() => {
					download();
				}}>Download file</button
			>
		</div>
		<div class="cut">
			<div>
				<RenderStruct callback={updater} valueProps={parsed} />
			</div>
			<pre>{reactiveParsed}</pre>
		</div>
	{/if}
</main>

<style>
	.cut {
		display: flex;
	}
	.cut > * {
		flex: 0.5;
	}
	main {
		max-width: none;
		margin: 0;
	}
	.center {
		margin: auto;
		text-align: center;
	}
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	pre {
		background-color: lightblue;
	}
</style>
