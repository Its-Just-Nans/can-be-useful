<script>
    import { client, currentRoom } from "../../writable";
    let msg = "";
    let matrixClient = null;
    client.subscribe((currClient) => {
        matrixClient = currClient;
    });
    let currRoom = {};
    currentRoom.subscribe((actualRoom) => {
        currRoom = actualRoom || {};
        currRoom.room_id = currRoom.roomId;
    });
</script>

<div class="content">
    <p>{currRoom.room_id || "no id"}</p>
    <p>{currRoom.name || "no name"}</p>
    <input bind:value={msg} />
    <button
        on:click={() => {
            if (msg === "") {
                return;
            }
            var testRoomId = currRoom.room_id;

            matrixClient
                .sendEvent(
                    testRoomId,
                    "m.room.message",
                    {
                        body: msg,
                        msgtype: "m.text",
                    },
                    ""
                )
                .then((res) => {
                    // message sent successfully
                })
                .catch((err) => {
                    console.log(err);
                });
        }}
    >
        Send
    </button>
</div>

<style>
    .content {
        flex-basis: 744px;
        flex-wrap: nowrap;
    }
</style>
