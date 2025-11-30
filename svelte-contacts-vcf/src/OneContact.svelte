<script>
    import { onMount } from "svelte";
    import { getName, isAsciiLetter } from "./functions";
    import { parsed } from "./stores";
    import { digestMessage } from "./vcard";
    import { navigate } from "svelte-routing";
    export let hash = "";

    const firstLetterHash = hash.split(".")[0];
    const hashPart = hash.split(".")[1];
    const filtered = $parsed.filter((onePerson) => {
        const name = getName(onePerson[1]);
        const firstLetter = name.split("").find((oneLetter) => isAsciiLetter(oneLetter)) || "";
        if (firstLetterHash == firstLetter.toLocaleLowerCase()) {
            return true;
        }
    });
    let data = [];
    onMount(async () => {
        for (const onePerson of filtered) {
            const sha = await digestMessage(JSON.stringify(onePerson[1]));
            if (sha === hashPart) {
                data = onePerson[1];
            }
        }
        if (data.length === 0) {
            navigate("/");
        }
    });
</script>

<hr />
<button
    on:click={() => {
        console.log(data);
    }}>log to console</button
>
<div>
    {#each data as oneValue}
        {#if oneValue[0] === "version"}
            <div>
                <span>Version: {oneValue[3]}</span>
            </div>
        {:else if oneValue[0] === "photo"}
            <div>
                <img src={oneValue[3]} alt="pic" />
            </div>
        {:else if oneValue[0] === "nickname"}
            <div>
                <span>Pseudo</span>
                <span>{oneValue[3]}</span>
            </div>
        {:else if oneValue[0] === "fn"}
            <div>
                <span>{oneValue[3]}</span>
            </div>
        {:else if oneValue[0] === "n"}
            <div>
                <div>Lastname : {oneValue[3][0].split(",")}</div>
                <div>Firstname: {oneValue[3][1].split(",")}</div>
                <div>Additional names: {oneValue[3][2].split(",")}</div>
                <div>Titles: {oneValue[3][3].split(",")}</div>
                <div>Suffixes: {oneValue[3][4].split(",")}</div>
            </div>
        {:else if oneValue[0] === "tel"}
            <div>
                <input type="phone" bind:value={oneValue[3]} />
            </div>
        {:else if oneValue[0] === "bday"}
            <div>
                <input type="date" bind:value={oneValue[3]} />
            </div>
        {:else if oneValue[0] === "categories"}
            <div>
                <span>Categories</span>
                {#each oneValue.slice(3) as oneCategory}
                    <span>{oneCategory}</span><span>,</span>
                {/each}
            </div>
        {:else if oneValue[0] === "note"}
            <div>
                <span>Notes</span>
                <textarea bind:value={oneValue[3]}></textarea>
            </div>
        {:else}
            {JSON.stringify(oneValue)}
        {/if}
    {/each}
</div>
