<script>
    import OneContactLine from "./OneContactLine.svelte";
    import { parsed } from "./stores";

    export let label = "";
    const filter = (onePerson) => {
        const cats = onePerson[1].find((oneValue) => oneValue[0] === "categories");
        if (!cats) {
            return false;
        }
        return cats.slice(3).includes(label);
    };
    let contacts = [];
    parsed.subscribe((value) => {
        contacts = value.filter(filter);
    });
</script>

<div>
    <p>{label} ({contacts.length})</p>
    {#each contacts as oneContact}
        <OneContactLine contact={oneContact} />
    {/each}
</div>
