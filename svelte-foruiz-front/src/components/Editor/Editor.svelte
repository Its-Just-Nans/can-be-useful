<script type="ts">
    import { fade } from "svelte/transition";
    import DOMPurify from "dompurify";
    import EditIcon from "../EditIcon.svelte";
    import renderer from "./script";
    export let placeholder = "";
    export let onChange = (arg) => {};
    export let maxlength = 200;
    const value = {
        raw: "",
        formatted: "",
    };
    let open = false;
</script>

<span
    class="icon"
    on:click={() => {
        open = true;
    }}
>
    <EditIcon />
</span>
{#if open}
    <div class="back" transition:fade>
        <div
            class="middle"
            on:click={(event) => {
                if (event.currentTarget === event.target) {
                    open = false;
                }
            }}
        >
            <div class="editor">
                <div class="edits">
                    <textarea
                        {maxlength}
                        {placeholder}
                        on:input={(event) => {
                            value.raw = event.target.value;
                            const a = DOMPurify.sanitize(renderer.render(value.raw));
                            value.formatted = a;
                        }}
                        value={value.raw}
                    />
                    <div class="formatted">
                        {@html value.formatted || ""}
                    </div>
                </div>
                <div class="buttons">
                    <div
                        class="button"
                        on:click={() => {
                            onChange("");
                            open = false;
                        }}
                    >
                        Cancel
                    </div>
                    <div
                        class="button"
                        on:click={() => {
                            onChange(value.raw);
                            open = false;
                        }}
                    >
                        Next
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .icon {
        vertical-align: sub;
        cursor: pointer;
    }
    .edits {
        display: flex;
    }
    .edits > * {
        min-width: 50%;
    }
    .middle {
        display: table-cell;
        vertical-align: middle;
    }
    .back {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0px;
        right: 0px;
        z-index: 10;
        display: table;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .editor {
        margin: auto;
        width: 85%;
        z-index: 20;
        padding: 20px;
        border: 1px solid black;
        border-radius: 10px;
        border-radius: 10px;
        background-color: white;
        box-shadow: 8px 8px 5px lightgray;
    }
    .formatted {
        line-break: anywhere;
        border: 1px dotted black;
        border-radius: 5px;
        max-height: 50vh;
        min-height: 1vh;
        overflow: auto;
        text-align: initial;
        padding: 2px;
    }
    .buttons {
        display: inline-flex;
    }
    .button {
        min-width: 25%;
        margin-top: 20px;
        cursor: pointer;
        padding: 10px;
        border: 1px solid black;
        box-shadow: 3px 3px 2px lightgray;
    }
    .edits > textarea {
        min-height: 25vh;
        border-radius: 5px;
        padding: 2px;
        max-width: 100%;
    }
    textarea:focus-visible {
        outline: none;
        transition: border 0.2s ease-in-out;
        border: 1px dashed grey;
    }
    @media (max-width: 640px) {
        .edits {
            flex-flow: column-reverse;
        }
        .editor {
            padding: 8px;
            width: 90%;
        }
    }
</style>
