<script lang="ts">
    import { onMount } from "svelte";
    import SoftCaptor from "./SoftCaptor";
    import { JtoS, PLACES_STATES } from "../../../shared/constants";
    import type { Place } from "../../../shared/types";
    import { myFetch } from "../utils";
    import { macs } from "../Admin/adminStore";
    import { parkingReloader } from "../OneParking/stores";
    import { getMacs } from "../Admin/utils";

    export let place: Place;
    const id = place.idPlace;
    let isACar = place.state === PLACES_STATES.BUSY;
    let msgsToDisplay: [string, {}][] = [];
    const addToDisplay = (data: {}, isSend = false) => {
        const typeMsg = isSend ? "SENDING " : "RECEIVING ";
        msgsToDisplay = [...msgsToDisplay, [typeMsg, data]];
    };
    let soft = new SoftCaptor(id);
    soft.addHandler(addToDisplay);

    onMount(() => {
        return () => {
            soft.destroy();
        };
    });
    let started = false;
    let macSelected = "NULL";
</script>

<span>Place "{id}" informations</span>
<br />
<div class="logger">
    <pre>{JSON.stringify(place, null, 4)}</pre>
</div>
{#if $macs.length > 0}
    <select bind:value={macSelected}>
        <option value="NULL">Select a MAC</option>
        {#each $macs as mac}
            <option value={mac}>
                {mac}
            </option>
        {/each}
    </select>
    {#if macSelected !== "NULL"}
        <button
            on:click={() => {
                myFetch("/place/link", "POST", {
                    idPlace: id,
                    mac: macSelected,
                }).then(() => {
                    $parkingReloader = { idPlace: id };
                    getMacs();
                });
            }}
        >
            Link the device to {macSelected}
        </button>
    {/if}
{/if}
<hr />
<div>
    <div>Sensor simulation</div>
    <div>
        <button
            on:click={() => {
                myFetch(`/place/${id?.toString()}/factoryReset`, "POST", {
                    idPlace: id,
                }).then(() => {
                    $parkingReloader = { idPlace: id };
                });
            }}>Factory Reset</button
        >
    </div>
    {#if started}
        <label for="isACar">Is a car ?</label>
        <input
            type="checkbox"
            id="isACar"
            bind:checked={isACar}
            on:input={(event) => {
                const { checked } = event.target;
                soft.isCar(checked);
            }}
        />
        <div class="logger">
            {#each msgsToDisplay as [typeMsg, data]}
                <span class="msg">
                    {typeMsg} - {JtoS(data)}
                </span>
            {/each}
        </div>
    {:else}
        <button
            on:click={() => {
                started = true;
                soft.start();
            }}>Start</button
        >
    {/if}
</div>

<style>
    .logger {
        height: 200px;
        overflow-y: scroll;
    }
    .logger pre {
        display: inline-block;
        vertical-align: top;
    }
    .msg {
        display: block;
    }
</style>
