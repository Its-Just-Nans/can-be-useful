<script lang="ts">
    import { history, myString } from "./stores";
    import Replacer from "./Replacer.svelte";
</script>

<div id="container">
    <textarea
        bind:value={$myString}
        on:input={() => {
            $history.push($myString);
        }}
    ></textarea>
</div>
<button
    on:click={() => {
        const last = $history.pop(); // current
        if (typeof last !== "undefined") {
            $myString = last;
        } else {
            $myString = "";
        }
    }}>CTRL Z</button
>
<Replacer />

<style>
    #container {
        height: 500px;
        width: 100%;
    }
    #container textarea {
        width: 99%;
        height: 100%;
    }
</style>
