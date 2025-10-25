<script>
    import { onMount } from "svelte";
    import { data as defaultData } from "./data";
    let items = defaultData.reduce((acc, item) => {
        acc[item] = false;
        return acc;
    }, {});
    let data = {};
    onMount(() => {
        data = readFromLocalStorage();
    });

    const readFromLocalStorage = () => {
        const jsonData = localStorage.getItem("pack-your-bag");
        if (jsonData) {
            return JSON.parse(jsonData);
        }
        return {};
    };

    const writeToLocalStorage = () => {
        localStorage.setItem("pack-your-bag", JSON.stringify(data));
    };

    const checkItem = (item) => {
        data[item] = !data[item];
        writeToLocalStorage();
    };
</script>

<div class="container">
    <div>
        <h2>Pack your bag 🎒!</h2>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
            role="button"
            tabindex="0"
            on:click={() => {
                data = {};
                writeToLocalStorage();
            }}
        >
            (reset)
        </span>
    </div>
    <div class="item-list">
        {#each Object.keys(items) as oneItem}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                role="button"
                tabindex="0"
                class="item"
                on:click={() => checkItem(oneItem)}
                class:selected={data[oneItem]}
            >
                <p>{oneItem}</p>
            </div>
        {/each}
    </div>
</div>

<style>
    .container {
        font-family: system-ui;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .item-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        align-items: center;
        font-family: Arial, sans-serif;
        width: 50%;
    }
    div span {
        font-size: 10px;
        cursor: pointer;
    }
    p {
        margin: 10px;
    }

    .item {
        display: flex;
        align-items: center;
        margin: 1px;
        padding: 1px;
        border: 1px solid #ccc;
        border-radius: 10px;
        cursor: pointer;
        width: 100%;
        justify-content: center;
        transition: background-color 0.2s ease;
    }

    .item:hover {
        background-color: #f0f0f0;
    }

    .item.selected {
        background-color: #90ee90; /* Change the color to your preferred selection color */
        border: 1px solid #006400;
    }
</style>
