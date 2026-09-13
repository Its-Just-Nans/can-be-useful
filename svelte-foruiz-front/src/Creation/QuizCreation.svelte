<script>
    import { fly } from "svelte/transition";
    import { Edit2Icon, CheckIcon, PlusCircleIcon } from "svelte-feather-icons";
    import renderHTML from "../utils/render";
    let editMode = -1;
    const createQuestion = ({ title = "", lesson = "", description = "" }) => {
        return {
            title: title || "Les nombres complexes",
            lesson:
                lesson ||
                "Les nombres complexes sont la plupart du temps définis par $i$ et $j$, mais ils peuvent utiliser n'importe quelle lettre !", // TODO lesson
            description: description || "Les nombres complexes blabla",
            choices: ["$$i$$", "$$80$$", "$$30+j$$"],
            result: [],
            type: "checkbox",
        };
    };
    export let quiz = {
        questions: [createQuestion({})],
        title: "Les nombres",
        description: "Mini cours sur les nombres complexes",
    };
    let actualQuestionIndex = 0;
    let step = 0;
    let isLesson = false;
    const steper = (toAdd) => {
        step = step + toAdd;

        const futurNum = actualQuestionIndex + toAdd;
        if (futurNum == 10) {
            return;
        }
        isLesson = !isLesson;
        if (isLesson == false) {
            if (!quiz.questions[step]) {
                quiz.questions.push(
                    createQuestion({
                        title: `My new question ${futurNum + 1}`,
                        lesson: `My Lesson ${futurNum + 1}`,
                        description: `My question desc ${futurNum + 1}`,
                    })
                );
                quiz.questions = quiz.questions;
            }
            if (futurNum >= 0) {
                actualQuestionIndex = futurNum;
            }
        }
    };
    let popUp = {
        show: false,
        msg: "",
        error: false,
    };
    const addAnswer = (indexAnswer) => {
        if (quiz.questions[actualQuestionIndex].result.includes(indexAnswer)) {
            quiz.questions[actualQuestionIndex].result.splice(
                quiz.questions[actualQuestionIndex].result.indexOf(indexAnswer),
                1
            );
        } else {
            quiz.questions[actualQuestionIndex].result.push(indexAnswer);
        }
        quiz.questions[actualQuestionIndex] = quiz.questions[actualQuestionIndex];
    };
</script>

<div class="quiz">
    <div class="quiz-body">
        <span class="quiz-infos" style="margin-top: 20px">
            <input placeholder="Quiz title" bind:value={quiz.title} />
        </span>
        <span class="quiz-infos">
            <textarea bind:value={quiz.description} />
        </span>
        <span>Question {actualQuestionIndex + 1}</span>
        {#if quiz.questions && quiz.questions.length > 0}
            <progress
                class="progress"
                max={quiz.questions.length >= 9 ? 9 : quiz.questions.length}
                value={actualQuestionIndex}
            >
                {(actualQuestionIndex / quiz.questions.length) * 100}%
            </progress>
            {#if isLesson}
                <div class="question">
                    <div class="question-lesson">
                        <textarea
                            class="center remove-outline"
                            bind:value={quiz.questions[actualQuestionIndex].lesson}
                        />
                        <div>{@html renderHTML(quiz.questions[actualQuestionIndex].lesson)}</div>
                    </div>
                </div>
            {:else}
                <div class="question">
                    <div class="question-up">
                        <div class="question-infos">
                            <input
                                class="remove-outline"
                                placeholder="question title"
                                bind:value={quiz.questions[actualQuestionIndex].title}
                            />
                        </div>

                        <div class="question-infos-desc">
                            <textarea
                                class="center remove-outline"
                                bind:value={quiz.questions[actualQuestionIndex].description}
                            />
                        </div>
                    </div>
                    {#if quiz.questions[actualQuestionIndex].choices && quiz.questions[actualQuestionIndex].choices.length > 0}
                        <div>
                            {#each quiz.questions[actualQuestionIndex].choices as oneAnswer, index}
                                <div class="wrapper-choice">
                                    <!-- <span class="question-name">Answer {index}</span> -->
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div
                                        class="choice-checkbox"
                                        class:selected={quiz.questions[actualQuestionIndex]?.result.includes(index)}
                                        on:click={(evt) => {
                                            if (editMode !== index || evt.target === evt.currentTarget) {
                                                addAnswer(index);
                                            }
                                        }}
                                    >
                                        {#if editMode === index}
                                            <textarea
                                                bind:value={quiz.questions[actualQuestionIndex].choices[editMode]}
                                            />
                                        {:else}
                                            <span>{@html renderHTML(oneAnswer) || "Pas de réponse"}</span>
                                        {/if}
                                    </div>
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <span
                                        class="cursor wrapper-icon"
                                        on:click={() => {
                                            if (editMode === -1) {
                                                editMode = index;
                                            } else if (editMode === index) {
                                                editMode = -1;
                                            } else {
                                                editMode = index;
                                            }
                                        }}
                                    >
                                        {#if editMode === index}
                                            <CheckIcon />
                                        {:else}
                                            <Edit2Icon />
                                        {/if}
                                    </span>
                                </div>
                            {/each}
                            {#if quiz.questions[actualQuestionIndex].choices.length <= 6}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div
                                    class="add-question"
                                    on:click={() => {
                                        if (quiz.questions[actualQuestionIndex].choices.length <= 6) {
                                            quiz.questions[actualQuestionIndex].choices = [
                                                ...quiz.questions[actualQuestionIndex]?.choices,
                                                "",
                                            ];
                                        }
                                    }}
                                >
                                    <PlusCircleIcon />
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/if}
        {/if}
        {#if popUp.show}
            <div class="quiz-popup-wrapper">
                <div
                    transition:fly={{ y: 200, duration: 1000 }}
                    class="quiz-popup"
                    class:error={popUp.error}
                    class:success={!popUp.error}
                >
                    <p>{popUp.msg}</p>
                </div>
            </div>
        {/if}
        <div class="footer-question">
            {#if actualQuestionIndex === 0 && step === 0}
                <div class="footer-button" />
            {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="footer-button border"
                    on:click={() => {
                        steper(-1);
                    }}
                >
                    <p>Back</p>
                </div>
            {/if}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="footer-button next"
                on:click={() => {
                    steper(1);
                }}
            >
                <p>Next</p>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="footer-button finish"
                on:click={() => {
                    // TODO check and send quiz
                }}
            >
                <p>Finish</p>
            </div>
        </div>
    </div>
    <pre class="debug">{JSON.stringify(quiz, null, 2)}</pre>
</div>

<style>
    .question-lesson {
        width: 100%;
        margin: auto;
    }
    .question-lesson textarea {
        width: 100%;
        resize: vertical;
        min-height: 300px;
    }
    .remove-outline {
        border-radius: 5px;
        padding: 5px;
        border-color: black;
    }
    .remove-outline:focus-visible {
        outline-offset: 0px;
        outline: none;
    }
    .question-infos {
        width: 50%;
        margin: auto;
        margin-bottom: 20px;
    }
    .question-infos input {
        width: 100%;
    }
    .question-infos-desc textarea {
        width: 100%;
    }
    .question-infos-desc {
        width: 70%;
        margin: auto;
        resize: vertical;
    }
    .wrapper-icon {
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        width: 30%;
        margin: auto;
        padding: 16px;
        border: 1px solid #dce2e5;
        -webkit-box-shadow: 0 4px 0 #eceff0;
        box-shadow: 0 4px 0 #eceff0;
    }
    .cursor {
        cursor: pointer;
    }
    .wrapper-choice {
        display: flex;
        align-items: center;
    }
    .wrapper-choice > .question-name {
        flex: 0.2;
    }
    .wrapper-choice > div {
        flex: 1;
    }
    .wrapper-choice > span {
        flex: 0.1;
    }
    .quiz-infos {
        display: block;
        margin: 0px auto;
    }
    .question-infos {
        display: block;
    }
    .add-question {
        background-color: dodgerblue;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        width: 30%;
        margin: auto;
        padding: 10px;
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
    .choice-checkbox textarea {
        width: 100%;
        max-width: 100%;
        resize: vertical;
    }
    .choice-checkbox {
        cursor: pointer;
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
        margin: 10px 0;
        padding: 16px 32px;
        -webkit-transition: all 0.1s ease-in;
        -o-transition: all 0.1s ease-in;
        transition: all 0.1s ease-in;
        word-break: break-word;
    }
    .choice-checkbox.selected {
        background: #bde8e0;
        border-color: #40bf9c;
        -webkit-box-shadow: 0 4px 0 #40bf9c;
        box-shadow: 0 4px 0 #40bf9c;
    }
    .question {
        background-color: white;
        padding: 10px;
        border-radius: 10px;
        text-align: center;
    }
    .debug {
        /* display: none; /* // TODO */
        text-align: left;
        position: fixed;
        left: 0px;
        top: 0px;
        opacity: 0.3;
        z-index: -1;
    }
    .quiz-popup.error {
        background-color: #f35843;
    }
    .quiz-popup.success {
        background-color: #40bf9c;
    }
    .quiz-popup {
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        border-radius: 4px;
        color: #fff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        font-size: 18px;
        justify-content: center;
        margin: 0 auto;
        width: 50%;
    }
    .quiz-popup-wrapper {
        margin: 0 auto;
        bottom: 0;
        height: 72px;
        bottom: 114px;
        display: -webkit-box;
        display: -ms-flexbox;
        position: fixed;
        width: 100%;
        z-index: 1;
        right: 0px;
        left: 0px;
    }
    .progress {
        width: 100%;
    }
    .quiz {
        font-family: Fira Sans;
    }
    .quiz-body {
        /*border: 1px solid yellow; /* // TODO */
        margin: 0 auto;
        width: 50%;
    }
    .question {
        width: 100%;
        /*border: 1px solid; /* // TODO */
        text-align: left;
        width: 100%;
    }
    .footer-question {
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        background: #f9f9fa;
        border-top: 2px solid #dce2e5;
        bottom: 0;
        justify-content: center;
        padding: 24px 0;
        position: fixed;
        width: 100%;
        z-index: 1;
        right: 0px;
    }
    .footer-button {
        margin: 0 50px;
        flex: 1;
        border-radius: 10px;
        cursor: pointer;
    }
    .footer-button.next {
        color: white;
        background-color: green;
    }
    .footer-button.finish {
        color: white;
        background-color: dodgerblue;
    }
    .footer-button.next {
        color: white;
        background-color: green;
    }
    .footer-button.border {
        border: 1px solid black;
    }
    @media (max-width: 1024px) {
        .quiz-body {
            margin: 0;
            width: 100%;
        }
        .quiz-popup {
            width: 80%;
        }
    }
</style>
