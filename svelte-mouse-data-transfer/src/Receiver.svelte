<script lang="ts">
    import { onMount } from "svelte";
    import { transformer, type StateType } from "./utils";
    let div: HTMLDivElement;
    let i = 0;
    let oldX = 0;
    let oldY = 0;
    let buffer = "";
    const updatePosition = (e: MouseEvent) => {
        mooving = true;
        console.log(i++, e);
        oldX = e.movementX;
        oldY = e.movementY;
        console.log(oldX, oldY);
        let state: StateType | null = null;
        const horizontalMoov = Math.abs(oldX) > Math.abs(oldY);
        if (horizontalMoov) {
            oldY = 0;
        } else {
            oldX = 0;
        }
        if (oldX > 1) {
            state = "right";
        } else if (oldX < -1) {
            state = "left";
        } else if (oldY > 1) {
            state = "down";
        } else if (oldY < -1) {
            state = "up";
        }
        console.log(state);
        buffer += state !== null ? transformer[state] : "";
        setTimeout(() => {
            mooving = false;
        }, 10);
    };
    let isLocked = false;
    let mooving = false;
    let received = "";
    onMount(() => {
        document.addEventListener(
            "pointerlockchange",
            () => {
                if (document.pointerLockElement === div) {
                    console.log("The pointer lock status is now locked");
                    isLocked = true;
                    i = 0;
                    buffer = "";
                    received = "";
                    document.addEventListener("mousemove", updatePosition, false);
                } else {
                    isLocked = false;
                    console.log("The pointer lock status is now unlocked");
                    document.removeEventListener("mousemove", updatePosition, false);
                    if (buffer.length > 0) {
                        // rebuild data from buffer binary to string
                        const orig = buffer
                            .match(/.{1,8}/g)
                            .map((byte) => String.fromCharCode(parseInt(byte, 2)))
                            .join("");
                        received = orig;
                    }
                }
            },
            false
        );
        div.addEventListener("click", async () => {
            await div.requestPointerLock();
        });
    });
</script>

<div class="divs">
    <div class="binder" bind:this={div}></div>
    {#if isLocked}
        {#if mooving}
            <p>Mouse moving</p>
        {:else}
            <p>Mouse not moving</p>
        {/if}
        <div>evts {i}</div>
        <div class="buffer">{buffer}</div>
    {:else}
        <p>Pointer is not locked</p>
        <p>Click on the black square to lock and then, press start button on the phone (sender)</p>
    {/if}
    <div>{received}</div>
</div>

<style>
    .divs {
        text-align: center;
    }
    .buffer {
        width: 60%;
        margin: auto;
        overflow-wrap: anywhere;
        height: 400px;
        overflow: auto;
    }
    .binder {
        display: block;
        background-color: black;
        width: 100px;
        height: 100px;
        margin: auto;
    }
</style>
