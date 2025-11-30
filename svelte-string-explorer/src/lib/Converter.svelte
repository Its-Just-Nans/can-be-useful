<script lang="ts">
    import { onMount } from "svelte";
    import SpanConverter from "./SpanConverter.svelte";
    import { myString, optionsConverter } from "./stores";

    let converted = "";
    let base = 2;
    let addSpace = true;
    let addPrefix = true;
    const getPrefix = () => {
        switch (base) {
            case 2:
                return "0b";
            case 8:
                return "0o";
            case 10:
                return "";
            case 16:
                return "0x";
        }
    };

    let elements: SpanConverter[] = [];

    const convert = (toConvert: string) => {
        elements.forEach((element) => {
            element.$destroy();
        });
        elements = [];
        $optionsConverter.base = base;
        $optionsConverter.padding = base === 2 ? 8 : base === 8 ? 3 : base === 10 ? 3 : 2;
        $optionsConverter.prefix = addPrefix ? getPrefix() : "";
        $optionsConverter.spacing = addSpace ? " " : "";
        const target = document.querySelector("#containerConverted div");
        if (!target) return;
        for (var i = 0; i < toConvert.length; i++) {
            const codePoint = toConvert[i].codePointAt(0);
            if (codePoint) {
                const element = new SpanConverter({
                    target,
                    props: {
                        codePoint,
                    },
                });
                elements.push(element);
            }
        }
        elements = elements;
    };
    onMount(() => {
        myString.subscribe((currentStr) => {
            convert(currentStr);
        });
    });
</script>

<div id="containerConverted">
    <div></div>
</div>

<br />

<select
    bind:value={base}
    on:change={() => {
        convert($myString);
    }}
>
    <option value={2}>Binary</option>
    <option value={8}>Octal</option>
    <option value={10}>Decimal</option>
    <option value={16}>Hexadecimal</option>
</select>

<label for="addSpace">Add space</label>
<input
    type="checkbox"
    bind:checked={addSpace}
    on:change={() => {
        convert($myString);
    }}
/>
<label for="addPrefix">Prefix</label>
<input
    type="checkbox"
    bind:checked={addPrefix}
    on:change={() => {
        convert($myString);
    }}
/>

<style>
    #containerConverted {
        flex-grow: 1;
        height: 80%;
        width: 100%;
    }
    #containerConverted div {
        width: 99%;
        height: 100%;
    }
</style>
