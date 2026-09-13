<script>
    import { fly } from "svelte/transition";
    import { currentQuiz, component } from "../utils/store";
    import Question from "./Question.svelte";
    import { getQuiz, getAnswers } from "../utils/api";
    import ListQuizzes from "./ListQuizzes.svelte";
    let quiz = {
        questions: [],
    };
    let canAddAnswer = false;
    let actualQuestionIndex = 0;
    currentQuiz.subscribe((newCurrent) => {
        quiz = newCurrent;
        if (quiz.questions === null && quiz._id) {
            getQuiz(quiz._id).then((resp) => {
                quiz = resp.data;
            });
        }
    });
    let solution = null;
    let step = 0;
    let answers = [];
    let popUp = {
        show: false,
        msg: "",
        error: false,
    };
    let actualAnswersIsCorrect = false;
    const showThePopUp = (state, error, msg) => {
        popUp.show = state;
        popUp.error = error;
        popUp.msg = msg;
    };
    const steper = async (change) => {
        showThePopUp(false);
        if (change === -1) {
            canAddAnswer = false;
            if (step === 0 && actualQuestionIndex - 1 >= 0) {
                actualQuestionIndex--;
                step = 1;
                canAddAnswer = true;
            } else if (step === 1) {
                step--;
            } else if (step === 2) {
                canAddAnswer = true;
                solution = null;
                answers = [];
                step--;
            }
        } else {
            if (quiz.questions && quiz.questions.length > actualQuestionIndex) {
                canAddAnswer = false;
                if (step === 1) {
                    if (answers.length === 0) {
                        showThePopUp(true, true, "You must answer the question");
                        canAddAnswer = true;
                        return;
                    }
                    console.log("checkAnswers - //TODO get from API");
                    getAnswers(quiz._id, answers, actualQuestionIndex).then((resp) => {
                        if (resp && typeof resp.data !== "undefined") {
                            if (resp.data === true) {
                                solution = answers.map((index) => {
                                    return quiz.questions[actualQuestionIndex].choices[index];
                                });
                                actualAnswersIsCorrect = true;
                                showThePopUp(true, false, "Great job !");
                            } else if (Array.isArray(resp.data)) {
                                solution = resp.data.map((index) => {
                                    return quiz.questions[actualQuestionIndex].choices[index];
                                });
                                actualAnswersIsCorrect = false;
                                showThePopUp(true, true, "Incomplete answer");
                            } else if (resp.data === false) {
                                solution = [];
                                actualAnswersIsCorrect = false;
                                showThePopUp(true, true, "Incorrect :/");
                            }
                        }
                    });
                } else if (step === 2) {
                    solution = null;
                    answers = [];
                    if (actualAnswersIsCorrect === false) {
                        steper(-1);
                        return;
                    } else {
                        actualAnswersIsCorrect = false;
                        actualQuestionIndex++;
                        step = -1;
                    }
                } else {
                    canAddAnswer = true;
                }
                step++;
            } else {
                // end
                component.set(ListQuizzes);
            }
        }
    };
</script>

<div class="quiz">
    <div class="quiz-body">
        {#if quiz.questions && quiz.questions.length === actualQuestionIndex}
            <p>Finito</p>
            <img src="./end.png" style="width: 100%;" alt="end" />
        {:else}
            <h3>{quiz.title || ""}</h3>
            <p>{quiz.description || ""}</p>
            {#if quiz.questions && quiz.questions.length > 0}
                <progress class="progress" max={quiz.questions.length} value={actualQuestionIndex}>
                    {(actualQuestionIndex / quiz.questions.length) * 100}%
                </progress>
                <div class="question">
                    <Question
                        bind:actualAnswers={answers}
                        {canAddAnswer}
                        {solution}
                        displayLesson={step === 0}
                        question={quiz.questions[actualQuestionIndex]}
                    />
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
                <div
                    class="footer-button border"
                    on:click={() => {
                        steper(-1);
                    }}
                >
                    <p>Back</p>
                </div>
            {/if}
            <div
                class="footer-button"
                on:click={() => {
                    steper(1);
                }}
            >
                {#if step === 0}
                    <p>Next</p>
                {:else if step === 1}
                    <p>Check</p>
                {:else if step === 2}
                    {#if actualAnswersIsCorrect}
                        <p>Continue</p>
                    {:else}
                        <p>Redo</p>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
    <pre class="debug">{JSON.stringify(quiz, null, 2)}</pre>
</div>

<style>
    .debug {
        display: none; /* // TODO */
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
    .footer-button:last-child {
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
