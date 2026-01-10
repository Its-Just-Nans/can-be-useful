<script>
    import { navigate } from "svelte-routing";
    import { PREFIX_URL } from "./stores";
    export let to = "";
    console.log("redirecting to", to);
    navigate(PREFIX_URL + to, { replace: true });
</script>
