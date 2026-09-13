<script>
    export let question = {};
    export let displayLesson = true;
    export let solution = null;
    export let actualAnswers = [];
    export let canAddAnswer = false;
    const addAnswer = (arrayAns, indexAnswer) => {
        if (arrayAns.includes(indexAnswer)) {
            arrayAns.splice(arrayAns.indexOf(indexAnswer), 1);
        } else {
            arrayAns.push(indexAnswer);
        }
        actualAnswers = arrayAns; // reactive
    };
</script>

{#if displayLesson}
    <p class="quiz-lesson">
        {question.lesson || "no lesson"}
    </p>
{:else}
    <div class="question-up">
        <h4>{question.title || "no title"}</h4>
        <p class="quiz-description">
            {question.description || "no description"}
        </p>
    </div>
    {#if question.choices && question.choices.length > 0}
        <div>
            {#each question.choices as oneAnswer, index}
                {#if question.type === "checkbox"}
                    <div
                        class="choice-checkbox"
                        class:selected={actualAnswers && actualAnswers.includes(index) && !solution}
                        class:choice-checkbox-active={canAddAnswer}
                        class:correctAns={actualAnswers &&
                            actualAnswers.includes(index) &&
                            solution !== null &&
                            solution.includes(oneAnswer)}
                        class:badAns={actualAnswers &&
                            actualAnswers.includes(index) &&
                            solution !== null &&
                            !solution.includes(oneAnswer)}
                        on:click={() => {
                            if (canAddAnswer) {
                                addAnswer(actualAnswers, index);
                            }
                        }}
                    >
                        {oneAnswer}
                    </div>
                {:else if question.type === "radio"}
                    <div
                        class="choice-checkbox"
                        class:selected={actualAnswers && actualAnswers.length > 0 && actualAnswers.includes(index)}
                        class:choice-checkbox-active={canAddAnswer}
                        class:correctAns={actualAnswers &&
                            actualAnswers.includes(index) &&
                            solution !== null &&
                            solution.includes(oneAnswer)}
                        class:badAns={actualAnswers &&
                            actualAnswers.includes(index) &&
                            solution !== null &&
                            !solution.includes(oneAnswer)}
                        on:click={() => {
                            if (canAddAnswer) {
                                addAnswer([], index);
                            }
                        }}
                    >
                        {oneAnswer}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
{/if}

<style>
    .quiz-lesson {
        padding: 5px;
    }
    .question-up {
        padding: 5px;
    }
    .quiz-description {
        color: #2d3846;
        font-size: 16px;
        line-height: 34px;
        margin-bottom: 32px;
        margin-top: 24px;
        white-space: break-spaces;
        font-family: Fira Sans;
    }
    .choice-checkbox {
        border: 1px solid #dce2e5;
        border-radius: 4px;
        -webkit-box-shadow: 0 4px 0 #eceff0;
        box-shadow: 0 4px 0 #eceff0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #2d3846;
        font-size: inherit;
        font-weight: 400;
        line-height: 24px;
        margin: 16px 0;
        padding: 16px 32px;
        -webkit-transition: all 0.1s ease-in;
        -o-transition: all 0.1s ease-in;
        transition: all 0.1s ease-in;
        word-break: break-word;
    }
    .choice-checkbox-active {
        cursor: pointer;
    }
    .choice-checkbox-active:hover {
        border-color: #2493df;
        -webkit-box-shadow: 0 4px 0 #c3dbec;
        box-shadow: 0 4px 0 #c3dbec;
    }
    .choice-checkbox.selected {
        background: #dbf0ff;
        border-color: #2493df;
        -webkit-box-shadow: 0 4px 0 #c3dbec;
        box-shadow: 0 4px 0 #c3dbec;
    }
    .choice-checkbox.correctAns {
        background: #bde8e0;
        border-color: #40bf9c;
        -webkit-box-shadow: 0 4px 0 #40bf9c;
        box-shadow: 0 4px 0 #40bf9c;
    }
    .choice-checkbox.badAns {
        background: #ffada1;
        border-color: #f35843;
        -webkit-box-shadow: 0 4px 0 #f35843;
        box-shadow: 0 4px 0 #f35843;
    }
</style>
