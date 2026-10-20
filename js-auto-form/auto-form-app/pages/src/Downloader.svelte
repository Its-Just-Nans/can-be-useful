<script>
    export let fieldName = "";
    export let fileName = "";
    import { getFile } from "./api";
</script>

<button
    on:click={() => {
        if (fieldName) {
            getFile(fieldName);
        }
    }}
>
    Download {fileName || "file"}
</button>
