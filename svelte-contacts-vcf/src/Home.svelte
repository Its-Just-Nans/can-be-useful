<script lang="ts">
    import ContactsDisplayer from "./ContactsDisplayer.svelte";
    import { filename, size, content, parsed } from "./stores";
</script>

<div class="content">
    <p>Contacts ({$parsed.length})</p>
    <ContactsDisplayer contacts={$parsed} />
</div>

<style>
    .content {
        padding: 10px;
        padding-left: 10px;
        border-radius: 10px;
        background-color: white;
        height: 100%;
        overflow-y: auto;
    }
</style>
