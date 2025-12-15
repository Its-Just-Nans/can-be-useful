<script>
    import { settings } from "../../writable";
    let actualSettings = {};
    settings.subscribe((writable) => {
        actualSettings = writable;
    });
</script>

<div>
    <input
        type="checkbox"
        on:input={(e) => {
            settings.update((oldValue) => {
                oldValue.allowMove = e.target.checked;
                return oldValue;
            });
        }}
    />
</div>
