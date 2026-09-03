<div class="wrapper">
    <div class="typing-demo">goto TP</div>
</div>

<style>
    .wrapper {
        height: 100vh;
        /*This part is important for centering*/
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .typing-demo {
        --numberchar: 7;
        width: calc(var(--numberchar) * 1.05ch);
        animation: typing 2s steps(var(--numberchar)),
            blink 0.5s step-end infinite alternate;
        white-space: nowrap;
        overflow: hidden;
        border-right: 3px solid;
        font-family: monospace;
        font-size: 2em;
    }

    @keyframes typing {
        from {
            width: 0;
        }
    }

    @keyframes blink {
        50% {
            border-color: transparent;
        }
    }
</style>
