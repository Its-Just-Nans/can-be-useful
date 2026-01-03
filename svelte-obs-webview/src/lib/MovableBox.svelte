<script lang="ts">
    import { onMount } from "svelte";
    let elmnt: HTMLDivElement;
    export let root = false;
    onMount(() => {
        const uniqid = Date.now().toString();
        elmnt.id = uniqid;
        dragElement();
    });

    function dragElement() {
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        elmnt.addEventListener("mousedown", dragMouseDown);

        function dragMouseDown(e) {
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener("mouseup", closeDragElement);
            // call a function whenever the cursor moves:
            document.addEventListener("mousemove", elementDrag);
        }

        function elementDrag(e) {
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = elmnt.offsetTop - pos2 + "px";
            elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
    }
    let html = "";
</script>

<div bind:this={elmnt} class="movable" style={` min-width: 50px;position:absolute;padding:10px;`}>
    {#if root}
        <slot />
    {:else}
        <div contenteditable="true" />
        <!-- <style class="edit-me">
            div > .edit-me {
                color: red;
                width: 100px;
                height: 20px;
            }
        </style> -->
    {/if}
</div>

<style>
    .movable:hover {
        border: 1px solid green;
    }
    .movable:hover .edit-me {
        display: block;
        white-space: pre;
    }
</style>
