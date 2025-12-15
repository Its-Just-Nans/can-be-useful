<script>
    let settings = [{ name: "input", value: "blue" }];
</script>

<div>
    {#each settings as { name, value }, index}
        <div>
            <p>{name}</p>
            <input {value} />
        </div>
    {/each}
</div>

<style>
</style>
