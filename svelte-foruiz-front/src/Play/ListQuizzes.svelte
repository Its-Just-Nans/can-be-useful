<script>
    import { onMount } from "svelte";
    import Play from "./Play.svelte";
    import { getQuizzes } from "../utils/api";
    import { currentQuiz, component } from "../utils/store";
    let listQuizzes = [];
    onMount(async () => {
        const a = await getQuizzes();
        listQuizzes = a.data || [];
    });
</script>

<div class="list_quizzes">
    {#if listQuizzes.length > 0}
        {#each listQuizzes as oneQuiz}
            <div
                class="one_quiz"
                on:click={() => {
                    currentQuiz.set(oneQuiz);
                    component.set(Play);
                }}
            >
                <h3>{oneQuiz.title || ""}</h3>
                <p>{oneQuiz.description || ""}</p>
            </div>
        {/each}
    {:else}
        <div>No quizzes :(</div>
    {/if}
</div>

<style>
    .list_quizzes {
        padding: 10px;
        text-align: center;
        margin: auto;
        width: 50%;
    }
    .one_quiz {
        border: 1px solid black;
        border-top: none;
        cursor: pointer;
        padding: 5px;
    }
    .one_quiz > * {
        margin: 0;
    }
    .one_quiz:first-child {
        border-top: 1px solid black;
    }
</style>
