<script lang="ts">
    import { onMount } from "svelte";
    import OneParking from "../../OneParking/OneParking.svelte";
    import { getParkingsOfUser } from "./parkings";
    import { parkings } from "../adminStore";
    import ParkingCreator from "../ParkingCreator/ParkingCreator.svelte";
    import { getCarsIn, getCarsOut } from "../utils";

    onMount(() => {
        getParkingsOfUser();
    });
    let parkingCreation = false;
    let selectedParking: number | null = null;
</script>

<div>
    {#each $parkings as parking}
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="parking-disp"
            on:click={() => {
                parkingCreation = false;
                selectedParking = parking.idParking;
                getCarsIn(selectedParking.toString());
                getCarsOut(selectedParking.toString());
            }}
            class:selected={selectedParking === parking.idParking}
        >
            {parking.name} ({parking.idParking})
        </div>
    {/each}
    <div class="parking-disp">
        <button
            on:click={() => {
                parkingCreation = !parkingCreation;
                selectedParking = null;
            }}>+</button
        >
    </div>
</div>
{#if parkingCreation}
    <ParkingCreator bind:isCreation={parkingCreation} />
{:else}
    {#key selectedParking}
        {#if selectedParking !== null}
            <OneParking
                idParking={selectedParking}
                isAdmin={true}
                callBackDelete={() => {
                    selectedParking = null;
                    getParkingsOfUser();
                }}
            />
        {/if}
    {/key}
{/if}

<style>
    .parking-disp {
        cursor: pointer;
        background-color: lightblue;
        padding: 10px;
        display: inline-block;
    }
    .selected {
        background-color: blue;
        color: white;
    }
</style>
