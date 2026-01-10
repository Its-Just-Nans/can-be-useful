<script>
    export let data;
    export let tag = "h2";
</script>

<div class="block vertical">
    <svelte:element this={tag}>
        {data.name}
    </svelte:element>
    <p>
        {data.subtext}
    </p>
</div>
