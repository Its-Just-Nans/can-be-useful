<script>
    import { client, currentRoom } from "../../writable";
    let currentClient = null;
    let list = [];
    client.subscribe((data) => {
        if (data) {
            currentClient = data;
            job();
        }
    });
    const job = async () => {
        const dmEvent = currentClient.getAccountData("m.direct");
        const test = currentClient.getAccountData("m.room.encryption");
        console.log(test);
        debugger;
        if (dmEvent && dmEvent.event && dmEvent.event.content) {
            for (const key in dmEvent.event.content) {
                list.push({
                    id: key,
                    id_room: dmEvent.event.content[key][0],
                });
            }
            list = list;
            debugger;
        }
    };
</script>

<div class="content">
    <p>Contact</p>
    {#each list as oneContact}
        <div
            class="oneContact"
            on:click={() => {
                const room = currentClient.getRoom(oneContact.id_room);
                console.log(room);
                currentRoom.set(room);
            }}
        >
            {oneContact.id}
            {oneContact.id_room}
        </div>
    {/each}
</div>

<style>
    .oneContact {
        cursor: pointer;
    }
    .content {
        flex-basis: 360px;
        flex-wrap: nowrap;
    }
</style>
