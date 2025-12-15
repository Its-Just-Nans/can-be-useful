<script>
    import { client, currentRoom } from "../../writable";
    let groups = [];
    let currentClient = null;
    client.subscribe((data) => {
        if (data) {
            currentClient = data;
            getPublicRooms();
        }
    });
    const getPublicRooms = async () => {
        currentClient.publicRooms().then((rooms) => {
            groups = rooms.chunk;
        });
    };
</script>

<div class="content">
    <p>GroupList</p>
    {#each groups as oneGroup}
        <div
            class="oneGroup"
            on:click={() => {
                currentRoom.set(oneGroup);
            }}
        >
            {oneGroup.name}
        </div>
    {/each}
</div>

<style>
    .oneGroup {
        cursor: pointer;
    }
    .content {
        flex-basis: 360px;
        flex-wrap: nowrap;
    }
</style>
