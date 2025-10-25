<script>
	import showdown from "showdown";
	import showdownHighlight from "showdown-highlight";
	import showdownKatex from "showdown-katex";
	const converter = new showdown.Converter({
		openLinksInNewWindow: true,
		extensions: [
			showdownKatex({
				throwOnError: true,
				displayMode: false,
			}),
			showdownHighlight(),
		],
	});
	converter.setFlavor("github");
	let input = "";
	let output = "";
	let isChecked = true;
	let transformQuote = true;
	let isLineBreak = true;
	const convert = () => {
		let temp = "";
		try {
			temp = converter.makeHtml(input);
		} catch (e) {
			console.log("error");
		}
		if (transformQuote) {
			temp = temp.replaceAll('"', "");
		}
		if (isLineBreak) {
			temp = temp.replaceAll("\n", "");
		}
		output = temp;
	};
</script>

<main>
	<div id="utils">
		<label for="checker">On click change</label>
		<input name="checker" type="checkbox" bind:checked={isChecked} />
		<br />
		<label for="checker">Transform double quote</label>
		<input name="checker" type="checkbox" bind:checked={transformQuote} />
		<br />
		<label for="checker">Remove line break</label>
		<input name="checker" type="checkbox" bind:checked={isLineBreak} />
		<br />
		<button
			on:click={() => {
				convert();
			}}
		>
			compile
		</button>
	</div>
	<br />
	<textarea
		bind:value={input}
		on:input={() => {
			console.log(isChecked);
			if (isChecked) {
				convert();
			}
		}}
	/>
	<textarea disabled={true}>{output}</textarea>
	<br />
	<div>
		{@html output}
	</div>
</main>

<style>
	label {
		display: inline;
	}
	#utils {
		text-align: center;
	}
	textarea {
		width: calc(50% - 10px);
		height: 80%;
	}
	main {
		height: 50%;
	}
</style>
