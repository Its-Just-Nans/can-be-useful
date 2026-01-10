<script lang="ts">
    import { generateParking } from "../../OneParking/parking";
    import { myFetch } from "../../utils";
    import { getParkingsOfUser } from "../Parkings/parkings";

    export let isCreation: boolean;

    const createParking = async () => {
        const places = generateParking();
        await myFetch("/places", "POST", { name: parkingName || "parking name", places: places });
        getParkingsOfUser();
    };
    let parkingName = "";
</script>

<p>ParkingCreator</p>

<input type="text" bind:value={parkingName} placeholder="Parking Name" />

<button
    on:click={() => {
        createParking();
        isCreation = false;
    }}>Create the parking</button
>
