<script>
    export let input = {
        type: "",
        value: "",
        name: "not-set",
        question: "Question not set",
        subtext: "",
        placeholder: "",
    };
    let style = `<style>
        input[type="radio"] {
            display: none;
        }
        #${input.name}-yes-value:checked ~ .${input.name}-yes-value {
            background-color: black;
            color: white;
        }
        #${input.name}-no-value:checked ~ .${input.name}-no-value {
            background-color: black;
            color: white;
    }</style>`;
</script>

<div class="div-input block">
    {#if input.type == "radio"}
        <div class="vertical">
            <p>{input.question}</p>
            <span>{input.subtext || ""}</span>
        </div>
        <div>
            {@html style}
            <input
                id={`${input.name}-yes-value`}
                checked={input.value === "true"}
                on:change={(event) => {
                    input.value = event.currentTarget.value;
                }}
                type="radio"
                name={`${input.name}-product`}
                value={"true"}
            />
            <input
                id={`${input.name}-no-value`}
                checked={input.value === "false"}
                on:change={(event) => {
                    input.value = event.currentTarget.value;
                }}
                type="radio"
                name={`${input.name}-product`}
                value={"false"}
            />
            <label for={`${input.name}-yes-value`} class={`${input.name}-yes-value label-style`}>Yes</label>
            <label for={`${input.name}-no-value`} class={`${input.name}-no-value label-style`}>No</label>
        </div>
    {:else if input.type == "checkbox"}
        <label for={`${input.name}-value`}>{input.question}</label>
        <input
            type="checkbox"
            id={`${input.name}-value`}
            checked={input.value}
            on:change={(event) => {
                input.value = event.currentTarget.checked;
            }}
        />
    {:else if input.type == "text"}
        <p>
            <label for={`${input.name}-value`}>{input.question}</label>
        </p>
        <input type="text" id={`${input.name}-value`} bind:value={input.value} placeholder={input.placeholder} />
    {/if}
</div>

<style>
    input[type="text"] {
        background-color: initial;
        outline: none;
        border: 0px;
    }
    input[type="text"]::placeholder {
        color: LightSlateGray;
    }
    .label-style {
        padding: 5px;
        margin: 1px;
        display: inline-block;
        cursor: pointer;
        border: 1px solid black;
    }
    .div-input {
        display: flex;
        flex: 1;
        align-items: center;
    }
    .div-input > * {
        text-align: center;
        flex: 1;
    }
</style>
