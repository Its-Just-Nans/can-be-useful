<script>
    import { Contact, GroupList, Timeline, Placable, Settings } from "./component/";
    import * as matrixcs from "matrix-js-sdk";
    import { client } from "./writable";
    window.global = window;
    let password = "";
    let connected = false;
    let domain = "";
    let username = "";
    let matrixClient;
    const job = async () => {
        const response = await matrixcs.createClient({ baseUrl: `https://${domain}` }).login("m.login.password", {
            user: username,
            password: password,
        });
        console.log(response);
        matrixClient = matrixcs.createClient({
            sessionStore: new matrixcs.WebStorageSessionStore(window.localStorage),
            cryptoStore: new matrixcs.MemoryCryptoStore(),
            baseUrl: `https://${domain}`,
            timelineSupport: true,
            accessToken: response.access_token,
            userId: response.user_id,
            deviceId: response.device_id,
        });
        debugger;
        await matrixClient.initCrypto();
        await matrixClient.startClient();
        connected = true;
        matrixClient.on("m.key.verification.request", (message) => {
            debugger;
        });
        matrixClient.on("Room.timeline", async (message, room) => {
            let body = "";
            try {
                if (message.event.type === "m.room.encrypted") {
                    const event = await matrixClient.crypto.decryptEvent(message);
                    ({ body } = event.clearEvent.content);
                } else {
                    ({ body } = message.event.content);
                }
                if (body) {
                    console.log(body);
                }
            } catch (error) {
                console.error("#### ", error);
            }
        });
        matrixClient.on("Room.timeline", function (event, room, toStartOfTimeline) {
            if (toStartOfTimeline) {
                return; // don't print paginated results
            }
            if (event.getType() !== "m.room.message") {
                return; // only print messages
            }
            console.log(
                // the room name will update with m.room.name events automatically
                "(%s) %s :: %s",
                room.name,
                event.getSender(),
                event.getContent().body
            );
        });

        matrixClient.once("sync", function (state, prevState, res) {
            console.log(state); // state will be 'PREPARED' when the matrixClient is ready to use
            client.set(matrixClient);
        });

        matrixClient.on("event", function (event) {
            console.log(event.getType());
            console.log(event);
        });
    };
</script>

<main>
    {#if !connected}
        <input bind:value={username} type="text" placeholder="username" />
        <input bind:value={password} type="password" placeholder="password" />
        <input bind:value={domain} type="text" placeholder="domain" />
        <button
            on:click={() => {
                job();
            }}
        >
            Connect
        </button>
    {:else}
        <div class="page">
            <Placable name="GroupList">
                <GroupList />
            </Placable>
            <Placable name="Settings">
                <Settings />
            </Placable>
            <Placable name="Timeline">
                <Timeline />
            </Placable>
            <Placable name="Contact">
                <Contact />
            </Placable>
        </div>
    {/if}
</main>

<style>
    .page {
        display: flex;
    }
    main {
        padding: 1rem;
    }
</style>
