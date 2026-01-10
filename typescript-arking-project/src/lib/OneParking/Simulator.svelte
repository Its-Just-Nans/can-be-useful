<script lang="ts">
    import { myFetch } from "../utils";

    export let idParking: number;
    let plaque = "";
    let direction = "in";
    let result = "";
</script>

<div class="wrap">
    <div>Simulator car detection</div>
    <input type="text" bind:value={plaque} placeholder="Enter license plate..." />

    <select bind:value={direction}>
        <option value="in">in</option>
        <option value="out">out</option>
    </select>

    <button
        on:click={() => {
            myFetch("/carDetected", "POST", { parkingid: idParking, plaque, direction }).then((res) => {
                result = JSON.stringify(res);
            });
        }}>send fake</button
    >
    <br />
    <div class="res">
        {result}
    </div>
</div>

<style>
    .wrap {
        border: 1px dotted black;
    }
    .res {
        max-width: 300px;
        overflow-wrap: anywhere;
    }
</style>
