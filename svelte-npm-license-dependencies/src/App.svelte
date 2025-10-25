<script>
	let parsed = {
		dependencies: {},
		devDependencies: {},
	};
	let resultString = "";
	let outputFilename = "";
	let doDependencies = false;
	let errors = [];
	let working = false;
	const handleSubmit = function () {
		handleChange();
		let object = {};
		if (
			parsed.dependencies &&
			Object.keys(parsed.dependencies).length > 0
		) {
			object.dependencies = parsed.dependencies;
			if (
				doDependencies &&
				parsed.devDependencies &&
				Object.keys(parsed.devDependencies).length > 0
			) {
				object.devDependencies = parsed.devDependencies;
			}
		} else {
			errors = ["dependencies not found"];
			return;
		}
		working = true;
		fetch("/api/", {
			method: "POST",
			body: JSON.stringify(object),
		}).then((response) => {
			working = false;
			if (response.status == 200) {
				response.json().then((resp) => {
					if (typeof resp !== "object") {
						try {
							resp = JSON.parse(resp);
						} catch (e) {}
					}
					if (resp.text) {
						console.log(resp.text);
					}
					if (resp.errors) {
						errors = resp.errors;
					}
					if (resp.dependencies && resp.dependencies.length > 0) {
						let data = "";
						for (const oneDep of resp.dependencies) {
							data += `\n${oneDep.name} - ${oneDep.npmLicense}\n${oneDep.repository}\n\n`;
							data += `${oneDep.license}\n`;
						}
						resultString = data;
						// https://stackoverflow.com/a/33542499/15568835
						var blob = new Blob([data], { type: "text/csv" });
						if (window.navigator.msSaveOrOpenBlob) {
							window.navigator.msSaveBlob(blob, filename);
						} else {
							var elem = window.document.createElement("a");
							elem.href = window.URL.createObjectURL(blob);
							if (
								outputFilename !== null &&
								outputFilename.trim() !== ""
							) {
								elem.download = outputFilename;
							} else {
								elem.download = "ALL_LICENSE";
							}
							document.body.appendChild(elem);
							elem.click();
							document.body.removeChild(elem);
						}
					}
				});
			}
		});
	};

	const handleChange = () => {
		try {
			parsed = JSON.parse(document.getElementById("textarea").value);
			errors = [];
		} catch (e) {
			errors = ["Error with JSON.parse"];
			parsed = {
				dependencies: {},
				devDependencies: {},
			};
		}
	};
</script>

<div style="text-align: center;">
	<h1>NPM License Dependencies</h1>
	<p class="inline">Made with</p>
	<a
		style="color:orange"
		class="link"
		href="https://svelte.dev"
		target="_blank"
	>
		<p class="inline">Svelte</p>
		<img class="inline logo" src="https://svelte.dev/favicon.png" alt="" />
	</a>
	<p class="inline">and</p>
	<a href="https://vercel.com/" class="link" target="_blank">
		<p class="inline">Vercel</p>
		<svg
			class="inline logo"
			style="vertical-align: text-top;"
			height="26"
			viewBox="0 0 75 65"
			><title>Vercel Logo</title><path
				d="M37.59.25l36.95 64H.64l36.95-64z"
			/></svg
		>
	</a>
	<p class="inline">!</p>
	<p class="inline">
		Check code <a
			class="link"
			href="https://github.com/Its-Just-Nans/npm-license-dependencies"
			>here</a
		>
	</p>
</div>
<table>
	<thead>
		<tr>
			<th colspan="3">
				<textarea
					id="textarea"
					on:change={handleChange}
					on:click={handleChange}
					on:keyup={handleChange}
					placeholder="Your package.json here"
				/>
				<br />
				{#if working != true}
					<label for="outputFilename">Output filename</label>
					<input type="text" bind:value={outputFilename} />
					<br />
					<label for="doDependencies">Do devDependencies</label>
					<input
						type="checkbox"
						on:click={() => {
							doDependencies = !doDependencies;
						}}
					/>
					<br />
					<br />
					<button
						on:click={(event) => {
							event.preventDefault();
							handleSubmit();
						}}>Send</button
					>
				{:else}
					<p style="font-weight: bold;">Loading...</p>
				{/if}
			</th>
		</tr>
	</thead>
	<tbody>
		<tr style="display:flex">
			<td class="results">
				<h2 class="titleCol">dependencies</h2>
			</td>
			<td class="results">
				<h2 class="titleCol">devDependencies</h2>
			</td>
			<td class="results">
				<h2 class="titleCol">Errors</h2>
			</td>
		</tr>
		<tr style="display:flex">
			<td class="results">
				<pre>{JSON.stringify(parsed.dependencies, null, 4)}</pre>
			</td>
			<td class="results">
				<pre>{JSON.stringify(parsed.devDependencies, null, 4)}</pre>
			</td>
			<td class="results">
				{#each errors as oneError, i}
					{#if typeof oneError === "string"}
						<p style="font-weight:bold" class="red">{oneError}</p>
					{:else if typeof oneError === "object"}
						<p style="font-weight:bold" class="red">
							{oneError.name} -
						</p>
						<a href={oneError.repository}>{oneError.repository}</a>
						<hr />
					{/if}
				{/each}
			</td>
		</tr>
		<tr>
			<td colspan="3">
				{#if resultString !== ""}
					<pre class="pre-res">
					{resultString}
					</pre>
				{/if}
			</td>
		</tr>
	</tbody>
</table>

<style>
	table {
		width: 100%;
	}
	.results {
		flex: 1;
	}
	.pre-res {
		background-color: whitesmoke;
		border-radius: 10px;
		border: 1px solid black;
		padding: 42px;
		max-width: 100vw;
		overflow: auto;
	}
	.inline {
		display: inline;
	}
	.titleCol {
		text-align: center;
		margin: 0px;
		margin-top: 10px;
	}
	textarea {
		width: 80%;
		max-width: 100%;
		min-height: 400px;
	}
	.red {
		color: red;
	}
	.logo {
		height: 20px;
		vertical-align: middle;
	}
	.link:visited {
		color: initial;
	}
	.link {
		font-weight: bold;
		text-decoration: none;
	}
</style>
