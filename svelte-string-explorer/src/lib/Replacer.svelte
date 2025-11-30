<script lang="ts">
    import { myString, history } from "./stores";
    let useRegex = false;
    let toReplace = "";
    let replacement = "";
</script>

<div>
    <label for="regex">Use Regex</label>
    <input type="checkbox" id="regex" bind:checked={useRegex} />
    <textarea placeholder="Text to replace" bind:value={toReplace}></textarea>
    <textarea placeholder="Replacement" bind:value={replacement}></textarea>
    <button
        on:click={() => {
            if (useRegex) {
                const regex = new RegExp(toReplace, "mg");
                $myString = $myString.replaceAll(regex, replacement);
            } else {
                $myString = $myString.replaceAll(toReplace, replacement);
            }
            $history.push($myString);
        }}>Replace</button
    >
</div>
