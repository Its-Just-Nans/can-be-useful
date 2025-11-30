<script>
    import { Link } from "svelte-routing";
    import { digestMessage } from "./vcard";
    import { onMount } from "svelte";
    import { getName, isAsciiLetter } from "./functions";
    import UserIcon from "./UserIcon.svelte";

    export let contact = [];
    const data = contact[1];
    let link = "";

    onMount(async () => {
        const name = getName(data);
        const firstLetter = name.split("").find((oneLetter) => isAsciiLetter(oneLetter)) || "";
        const id = await digestMessage(JSON.stringify(data));
        link = `/person/${firstLetter.toLocaleLowerCase()}.${id}`;
    });
    const photo = data.find((oneValue) => oneValue[0] === "photo");
</script>

<Link to={link}>
    <div class="one-line">
        <div>
            {#if photo}
                <img class="img-user" src={photo[3]} alt="pic" />
            {:else}
                <div class="img-user">
                    <UserIcon />
                </div>
            {/if}
        </div>
        {#each data as oneValue}
            {#if oneValue[0] === "photo"}{:else if oneValue[0] === "fn"}
                <span>
                    <span>{oneValue[3]}</span>
                </span>
            {/if}
        {/each}
    </div>
</Link>

<style>
    .img-user {
        width: 50px;
        height: 50px;
        border-radius: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 1px solid #ccc;
    }
    .one-line {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
</style>
