<script>
    import { writable } from "svelte/store";
    import Editor from "../components/Editor/Editor.svelte";
    import PlusIcon from "../components/PlusIcon.svelte";
    import RemoveIcon from "../components/RemoveIcon.svelte";
    export let save = null;
    export let indexOfQuestion = "";
    const typeOfAnswers = {
        CHECKBOX: "checkbox",
        RADIO: "radio",
    };
    let quizCreation = writable({});
    quizCreation.subscribe((newQuestion) => {
        save(newQuestion);
    });
    $quizCreation = {
        title: "",
        lesson: "",
        description: "",
        choices: [""],
        result: [],
        type: "checkbox",
    };
</script>

<div class="question">
    <div class="lesson">
        <p class="field">Lesson</p>
        <Editor
            placeholder={"lesson"}
            onChange={(value) => {
                $quizCreation.lesson = value;
            }}
        />
    </div>
    <div class="upper-question">
        <p class="field">Title</p>
        <Editor
            placeholder={"title"}
            onChange={(value) => {
                $quizCreation.title = value;
            }}
        />
        <br />
        <p class="field">Question's description</p>
        <Editor
            placeholder={"description"}
            onChange={(value) => {
                $quizCreation.description = value;
            }}
        />
        <br />
        <select bind:value={$quizCreation.type}>
            {#each Object.entries(typeOfAnswers) as [name, value]}
                <option {value}>
                    {value}
                </option>
            {/each}
        </select>
    </div>
    {#if $quizCreation.choices && $quizCreation.choices.length}
        {#each $quizCreation.choices as oneChoice, indexOfChoice}
            <div class="choice">
                <div class="inline">
                    {#if $quizCreation.type == typeOfAnswers.CHECKBOX}
                        <input
                            type="checkbox"
                            name={`choice-${indexOfChoice}`}
                            on:input={(event) => {
                                let index = $quizCreation.result.indexOf(indexOfChoice);
                                if (index === -1) {
                                    $quizCreation.result.push(indexOfChoice);
                                } else {
                                    $quizCreation.result.splice(index, 1);
                                }
                                $quizCreation.result = $quizCreation.result;
                            }}
                        />
                    {:else if $quizCreation.type == typeOfAnswers.RADIO}
                        <input
                            type="radio"
                            name={`choice-${indexOfQuestion}`}
                            on:input={(event) => {
                                $quizCreation.result = [indexOfChoice];
                            }}
                        />
                    {/if}
                </div>
                {#if $quizCreation.type == typeOfAnswers.CHECKBOX || $quizCreation.type == typeOfAnswers.RADIO}
                    <input
                        value={oneChoice}
                        placeholder={`${"Answer"} ${indexOfChoice + 1}`}
                        type="text"
                        on:input={(event) => {
                            if (typeof $quizCreation.choices[indexOfChoice] === "undefined") {
                                $quizCreation.choices.push("");
                            }
                            $quizCreation.choices[indexOfChoice] = event.target.value;
                        }}
                        on:keypress={(e) => {
                            if (e.key === "Enter") {
                                $quizCreation.choices.push("");
                                $quizCreation.choices = $quizCreation.choices; // force update;
                            }
                        }}
                    />
                {/if}
                {#if indexOfChoice !== 0}
                    <span
                        class="remove"
                        on:click={() => {
                            if (indexOfChoice > -1 && $quizCreation.choices?.length > 1) {
                                $quizCreation.choices.splice(indexOfChoice, 1);
                                $quizCreation.choices = [...$quizCreation.choices];
                            }
                        }}
                    >
                        <RemoveIcon size={"16px"} />
                    </span>
                {:else}
                    <span style="display: inline-flex; padding: 1px;vertical-align: sub;">
                        <svg width="16px" height="16px" />
                    </span>
                {/if}
                <br />
            </div>
        {/each}
    {/if}
    <!-- {#if $quizCreation.type == typeOfAnswers.CHECKBOX}
        <input type="checkbox" disabled />
    {:else if $quizCreation.type == typeOfAnswers.RADIO}
        <input type="radio" disabled />
    {/if}
    <input
        class="special"
        placeholder={"Add answer"}
        on:click={() => {
            if (typeof $quizCreation.choices === "undefined") {
                $quizCreation.choices = [];
            }
            $quizCreation.choices.push("");
            $quizCreation.choices = $quizCreation.choices; // force update;
        }}
        readonly
    /> -->
    {#if $quizCreation.choices.length < 6}
        <div class="addAnswer">
            <span
                class="question-addAnswer"
                placeholder={"Add answer"}
                on:click={() => {
                    if (typeof $quizCreation.choices === "undefined") {
                        $quizCreation.choices = [];
                    }
                    if (typeof $quizCreation.type === "undefined") {
                        $quizCreation.type = typeOfAnswers.CHECKBOX;
                    }
                    if ($quizCreation.choices.length < 6) {
                        $quizCreation.choices.push("");
                        $quizCreation.choices = $quizCreation.choices; // force update;
                    }
                }}
            >
                <PlusIcon />
            </span>
        </div>
    {/if}
</div>

<style>
    .field {
        display: inline-block;
    }
    .addAnswer {
        display: inline-flex;
        margin: 5px;
    }
    .question-addAnswer {
        display: inline-block;
        background-color: limegreen;
        border-radius: 5px;
        cursor: pointer;
        width: 80px;
        text-align: center;
    }
    .question-addAnswer:hover {
        transition: background-color 0.2s ease-in-out;
        background-color: lightgreen;
    }
    .upper-question > * {
        margin-bottom: 10px;
    }
    .remove {
        border: 1px solid black;
        border-radius: 4px;
        background-color: orangered;
        display: inline-flex;
        cursor: pointer;
        vertical-align: sub;
    }
    select {
        border: 0px;
        padding: 5px;
    }
    select:focus-visible {
        outline: 0px;
    }
    .question {
        background-color: white;
        padding: 10px;
        border-radius: 10px;
        text-align: center;
    }
    input {
        border: 0px;
        border-bottom: 2px solid;
        padding: 5px;
        outline: 0;
        border-color: grey;
        transition: border-color 0.1s;
        transition: border-bottom 0.1s;
    }
    input:focus {
        border-color: blue;
    }
    input:focus-visible {
        outline: 0px;
    }
    .inline {
        display: inline;
    }
    .choice {
        margin-bottom: 2px;
        margin: 0 auto;
    }
    .upper-question {
        margin-bottom: 5px;
    }
</style>
