<script>
    async function installBlock(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file) {
                const pathToFile = file.path;
                await window.parent.block.installBlock(pathToFile);
            }
        } else {
            // upload by link
        }
    }
</script>

<div>
    <button
        on:click={() => {
            alert(window.parent.block.osTEST());
        }}
    >
        click
    </button>
    <input
        type="file"
        on:change={async (e) => {
            await installBlock(e);
        }}
    />
</div>

<style>
</style>
