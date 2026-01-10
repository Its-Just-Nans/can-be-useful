<script>
    import { onMount } from "svelte";
    import { logout } from "../Login/login";
    import { user } from "../stores";
    import { getParkings, parkingList } from "../account";
    import { myFetch } from "../utils";
    import OneParking from "../OneParking/OneParking.svelte";
    import { parkingReloader, editMode } from "../OneParking/stores";

    onMount(() => {
        getParkings();
        $editMode = false;
    });
    let amount = 0;
    let parkingSelected = "NULL";
</script>

{#if $user}
    <button
        on:click={() => {
            logout();
        }}>Logout</button
    >

    <p>Name: {$user.name}</p>
    <p>Plaque d'immatriculation: {$user.plaque}</p>
    <p>Balance: {$user.balance}</p>
    <input type="number" id="balance" bind:value={amount} />
    <button
        on:click={() => {
            myFetch("/addBalance", "POST", { amount }).then((res) => {
                $user = res;
                amount = 0;
            });
        }}>Add to balance</button
    >

    <details>
        <summary>Reserve a place</summary>
        <select
            id="place"
            on:input={() => {
                console.log("input");
            }}
            bind:value={parkingSelected}
        >
            <option value={"NULL"}>--selectionner le parking--</option>
            {#each $parkingList as place}
                <option value={place.idParking}>{place.name}</option>
            {/each}
        </select>
    </details>

    {#if parkingSelected !== "NULL"}
        {#key parkingSelected}
            <OneParking
                idParking={parseInt(parkingSelected)}
                isAdmin={false}
                reserveSlot={(p) => {
                    console.log("reserveSlot", p);
                    myFetch("/reservePlace", "POST", { idPlace: p.idPlace }).then((res) => {
                        $parkingReloader = { idPlace: p.idPlace };
                    });
                }}
            />
        {/key}
    {/if}
{/if}
