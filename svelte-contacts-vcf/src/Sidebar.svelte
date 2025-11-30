<script>
    import { parsed, sidebar } from "./stores";
    import { Link, useLocation } from "svelte-routing";
    import Tag from "./Tag.svelte";
    import UserIcon from "./UserIcon.svelte";

    $: categories = $parsed.reduce((acc, onePerson) => {
        // extract categories
        const cats = onePerson[1].find((oneValue) => oneValue[0] === "categories");
        if (!cats) {
            return acc;
        }
        return {
            ...acc,
            ...cats.slice(3).reduce((acc, oneCat) => {
                if (!acc[oneCat]) {
                    acc[oneCat] = oneCat;
                }
                return acc;
            }, {}),
        };
    }, {});
    const location = useLocation();
</script>

<div class="sidebar">
    <div class="libs">
        <div class="link">
            <UserIcon />
            <Link to="/">Contacts ({$parsed.length})</Link>
        </div>
    </div>
    <div>Libellés</div>
    <div class="libs">
        {#each Object.keys(categories) as oneCat}
            <div class="one-label" class:colored={oneCat === $location.pathname.split("/")[2]}>
                <Tag />
                <Link to="/label/{oneCat}">
                    <div>
                        {oneCat}
                    </div>
                </Link>
            </div>
        {/each}
    </div>
</div>

<style>
    .sidebar {
        padding: 10px;
    }
    .libs {
        padding: 10px;
    }
    .link {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
    }
    .colored {
        background-color: lightblue;
    }
    .one-label {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        border-radius: 5px;
        border: 1px solid transparent;
        margin-top: 10px;
        padding: 10px;
    }
</style>
