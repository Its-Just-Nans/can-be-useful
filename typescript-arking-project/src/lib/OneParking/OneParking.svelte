<script lang="ts">
    import { onMount } from "svelte";
    import { editMode, view3d, places } from "./stores";
    import { Parking } from "./parking";
    import { myFetch } from "../utils";
    import OnePlace from "../OnePlace/OnePlace.svelte";
    import type { Place } from "../../../shared/types";
    import { PLACES_STATES, PLACES_TYPES } from "../../../shared/constants";
    import Simulator from "./Simulator.svelte";
    import Placable from "../Placable/Placable.svelte";
    import { parkingReloader } from "./stores";
    import { carsIn, carsOut } from "../Admin/adminStore";

    export let idParking: number;
    export let isAdmin = false;
    export let callBackDelete = () => {};
    export let reserveSlot = (a: Place) => {};

    let parking = new Parking(idParking.toString(), isAdmin);

    let canvas: HTMLCanvasElement | null = null;

    onMount(() => {
        canvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                parking.start(canvas as HTMLCanvasElement, ctx);
            }
        }
    });
    let placeIndex: number | null = null;
    places.subscribe((newPlaces) => {
        if (newPlaces.length > 0 && !$editMode) {
            const possibleNewPlaceIndex = newPlaces.findIndex((oneP) => oneP.selected);
            if (possibleNewPlaceIndex !== -1) {
                placeIndex = possibleNewPlaceIndex;
            } else if (placeIndex !== null) {
                newPlaces[placeIndex].selected = true;
                places.set(newPlaces);
            }
        } else {
            placeIndex = null;
        }
    });
    let selectionEdit = "--NULL--";
    let selectionStateEdit = "--NULL--";
</script>

<div class="parking">
    {#if isAdmin}
        <details open>
            <summary>Car moving in: {$carsIn.length}</summary>
            {#if $carsIn.length}
                <span>{JSON.stringify($carsIn)}</span>
            {/if}
        </details>
        <details open>
            <summary>Car moving out: {$carsOut.length}</summary>
            {#if $carsOut.length}
                <span>{JSON.stringify($carsOut)}</span>
            {/if}
        </details>
        <button
            on:click={() => {
                if (confirm("Are you sure ?")) {
                    myFetch(`/parking/${idParking}`, "DELETE").then(() => {
                        callBackDelete();
                        $places = [];
                    });
                }
            }}>Delete this parking</button
        >
        <div>
            <label for="editMode">Edit mode</label>
            <input type="checkbox" bind:checked={$editMode} />
        </div>
        <Placable name="simulator">
            <Simulator {idParking} />
        </Placable>
    {/if}
    <!-- <label for="editMode">3D mode</label>
    <input type="checkbox" bind:checked={$view3d} /> -->
    <div>
        Free places: {$places.filter((onePlace) => onePlace.state === PLACES_STATES.FREE).length}/{$places.length}
    </div>
    <div>
        Electric places: {$places.filter(
            (onePlace) => onePlace.typePlace === PLACES_TYPES.ELECTRIC && onePlace.state === PLACES_STATES.FREE
        ).length}/{$places.filter((onePlace) => onePlace.typePlace === PLACES_TYPES.ELECTRIC).length}
    </div>
    <div class="canvas-container">
        <canvas id="gridCanvas"></canvas>
    </div>
    {#if isAdmin}
        {#if $editMode}
            <div class="dynamicPlace">
                Places selected {$places.filter((oneP) => oneP.selected).length}
                {#if $places.filter((oneP) => oneP.selected).length > 0}
                    <p>Change the type</p>
                    <select bind:value={selectionEdit}>
                        <option value="--NULL--">--choose---</option>
                        {#each Object.entries(PLACES_TYPES) as oneType}
                            <option value={oneType[1]}>{oneType[0]}</option>
                        {/each}
                    </select>
                    {#if selectionEdit !== "--NULL--"}
                        <button
                            on:click={() => {
                                const promises = $places
                                    .filter((oneP) => oneP.selected)
                                    .map((oneP) => {
                                        return myFetch(`/place/${oneP.idPlace}/typePlace`, "PATCH", {
                                            typePlace: selectionEdit,
                                        });
                                    });
                                Promise.all(promises).then(() => {
                                    selectionEdit = "--NULL--";
                                    $parkingReloader = {};
                                });
                            }}>Set to {selectionEdit}</button
                        >
                    {/if}
                    <p>Change the state</p>
                    <select bind:value={selectionStateEdit}>
                        <option value="--NULL--">--choose---</option>
                        {#each Object.entries(PLACES_STATES) as oneType}
                            <option value={oneType[1]}>{oneType[0]}</option>
                        {/each}
                    </select>
                    {#if selectionStateEdit !== "--NULL--"}
                        <button
                            on:click={() => {
                                const promises = $places
                                    .filter((oneP) => oneP.selected)
                                    .map((oneP) => {
                                        return myFetch(`/place/${oneP.idPlace}/state`, "PATCH", {
                                            state: selectionStateEdit,
                                        });
                                    });
                                Promise.all(promises).then(() => {
                                    selectionStateEdit = "--NULL--";
                                    $parkingReloader = {};
                                });
                            }}>Set to {selectionStateEdit}</button
                        >
                    {/if}
                {/if}
            </div>
        {:else}
            <div class="dynamicPlace">
                {#if placeIndex !== null}
                    {#key placeIndex}
                        <OnePlace place={$places[placeIndex]} />
                    {/key}
                {/if}
            </div>
        {/if}
    {:else if typeof placeIndex === "number" && $places[placeIndex] && $places[placeIndex].state === PLACES_STATES.FREE && $places[placeIndex].typePlace !== PLACES_TYPES.ROAD}
        <button
            on:click={() => {
                if (typeof placeIndex === "number" && $places[placeIndex]) {
                    reserveSlot($places[placeIndex]);
                }
            }}
            >Reserve place
        </button>
    {/if}
</div>

<style>
    .dynamicPlace {
        display: inline-block;
        vertical-align: top;
    }
    .canvas-container {
        border: 1px dashed black;
        padding: 10px;
        display: inline-block;
    }
</style>
