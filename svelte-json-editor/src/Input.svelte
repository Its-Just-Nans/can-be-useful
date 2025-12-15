<script>
    import RenderStruct from "./RenderStruct.svelte";
    export let value = null;
    export let index = null;
    export let callBack = null;
    const DEFAULT_INT_VALUE = 0;
    const getValue = () => {
        if (typeof value === "string") {
            return "text";
        } else if (typeof value == "number") {
            return "number";
        } else if (Array.isArray(value)) {
            return "array";
        } else if (typeof value === "object") {
            return "object";
        }
    };
    let selected = getValue();
    let inputType = ["text", "number", "array", "object"];
    const changeValueType = (newSelected) => {
        try {
            selected = newSelected;
            if (selected === "text") {
                value = value.toString();
            } else if (selected === "number") {
                value = parseFloat(value) || DEFAULT_INT_VALUE;
            } else if (selected === "array") {
                value = [];
            } else if (selected === "object") {
                value = {};
            }
            getValue();
            callBack(index, value);
        } catch (e) {
            debugger;
        }
    };
</script>

<div>
    {#if value != null}
        <select
            value={selected}
            on:change={(evt) => {
                changeValueType(evt.target.value);
            }}
        >
            {#each inputType as oneInput}
                <option value={oneInput}>
                    {oneInput}
                </option>
            {/each}
        </select>
        <br />
        {#if getValue(value) === "number"}
            <input
                on:input={(evt) => {
                    let newValue = parseFloat(evt.target.value) || DEFAULT_INT_VALUE;
                    callBack(index, newValue);
                }}
                type="number"
                {value}
            />
        {:else if getValue(value) === "text"}
            <input
                on:input={(evt) => {
                    callBack(index, evt.target.value);
                }}
                type="text"
                {value}
            />
        {:else if getValue(value) === "object" || getValue(value) === "array"}
            <RenderStruct
                callback={(newValue) => {
                    callBack(index, newValue);
                }}
                valueProps={value}
            />
        {/if}
    {/if}
</div>

<style>
    div {
        display: inline;
    }
</style>
