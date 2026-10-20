<script>
    import { onMount } from "svelte";
    import Downloader from "../../Downloader.svelte";
    import { translate } from "../../../useful";
    import { getData, saveData } from "../../api";
    export let data = [];
    export let name = "";
    let listData = [];
    let loader = false;
    onMount(() => {
        getData(JSON.stringify({ path: name })).then((res) => {
            if (res && res.data && res.data.length > 0) {
                for (const oneElement of res.data) {
                    // put in data;
                    const correctName = oneElement.entryName.split("#")[1] || "";
                    const index = data.findIndex((el) => {
                        return el.translate == correctName;
                    });
                    if (index > -1) {
                        data[index].keywords = oneElement.keywords;
                        if (oneElement.comment && oneElement.comment.startsWith("file")) {
                            data[index].fieldName = oneElement.entryName;
                            data[index].fileName = oneElement.comment.split("filename=")[1] || "Error filename";
                        } else {
                            data[index].value = oneElement.value || "";
                        }
                    }
                }
            }
        });
    });
    const add = (oneInput) => {
        addToList({
            name: `${name}#${oneInput.translate}`,
            type: oneInput.type,
            value: oneInput.value,
            keywords: oneInput.keywords || [],
        });
    };
    const addToList = (data) => {
        const index = listData.findIndex((el) => {
            return el.name === data.name;
        });
        if (index > -1) {
            listData[index] = data;
        } else {
            listData.push(data);
        }
    };
</script>

<div id="main">
    <div class="header-top">
        <h2>{translate(`trans:${name}`)}</h2>
    </div>
    <hr />
    <div class="body">
        {#each data as oneInput}
            <div class="one-input">
                <p>{translate(oneInput.translate)}</p>
                {#if oneInput.type == "file"}
                    <input
                        type="file"
                        on:input={(e) => {
                            const file = e.target.files[0];
                            const formData = new FormData();
                            formData.append("uploaded", file);
                            addToList({
                                name: `${name}#${oneInput.translate}`,
                                fileName: file.name || `${name}#${oneInput.translate}`,
                                type: oneInput.type,
                                value: formData,
                                keywords: oneInput.keywords || [],
                            });
                        }}
                    />
                    {#if oneInput.fieldName}
                        <Downloader fileName={oneInput.fileName} fieldName={oneInput.fieldName} />
                    {/if}
                {:else}
                    <input
                        type={oneInput.type}
                        value={oneInput.value || null}
                        on:input={(e) => {
                            // TODO check if already in array
                            oneInput.value = e.target.value;
                            add(oneInput);
                        }}
                    />
                    <br />
                    <small>Mot-clés</small>
                    <span>
                        {#if oneInput.keywords}
                            {#each oneInput.keywords as keyword}
                                <span class="keyword">
                                    <span>{keyword}</span>
                                    <span
                                        class="keyword_delete"
                                        on:click={() => {
                                            const index = oneInput.keywords.indexOf(keyword);
                                            if (index > -1) {
                                                oneInput.keywords.splice(index, 1);
                                                oneInput.keywords = oneInput.keywords; // update
                                            }
                                            add(oneInput);
                                        }}>x</span
                                    >
                                </span>
                            {/each}
                        {/if}
                        <input
                            type="text"
                            class="keyword_input"
                            placeholder="enter keywords"
                            on:keypress={(e) => {
                                if (e.key === "Enter") {
                                    e.target.nextElementSibling.click();
                                }
                            }}
                        />
                        <span
                            class="keyword_plus"
                            on:click={(e) => {
                                const newValue = e.target.previousElementSibling.value.toLowerCase();
                                if (!oneInput.keywords) {
                                    oneInput.keywords = [];
                                }
                                if (!oneInput.keywords.includes(newValue) && newValue !== "") {
                                    oneInput.keywords.push(newValue);
                                    oneInput.keywords = oneInput.keywords;
                                }
                                e.target.previousElementSibling.value = "";
                                addToList({
                                    name: `${name}#${oneInput.translate}`,
                                    type: oneInput.type,
                                    value: oneInput.value,
                                    keywords: oneInput.keywords || [],
                                });
                            }}>+</span
                        >
                    </span>
                {/if}
            </div>
        {/each}
        <div class="save_button">
            <button
                on:click={async () => {
                    console.log(listData);
                    loader = true;
                    await saveData(listData);
                    loader = false;
                }}
            >
                Save
            </button>
            {#if loader}
                <div class="loader" />
            {/if}
        </div>
    </div>
</div>

<style>
    .loader {
        border: 4px solid #f3f3f3; /* Light grey */
        border-top: 4px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 25px;
        height: 25px;
        animation: spin 2s linear infinite;
        text-align: center;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .save_button {
        position: fixed;
        right: 20px;
        top: 80px;
        display: inline-flex;
    }
    .save_button > button {
        background-color: initial;
        border: 2px solid blue;
        border-radius: 10px;
    }
    .keyword .keyword_delete {
        display: none;
    }
    .keyword:hover .keyword_delete {
        cursor: pointer;
        display: inline;
    }
    .keyword {
        background-color: #65aeff;
        border-radius: 5px;
        margin-right: 2px;
        padding: 2px;
    }
    .keyword_input {
        height: 17px;
        width: 115px;
    }
    .keyword_plus {
        border-radius: 10px;
        border: 1px solid;
        height: 21px;
        width: 21px;
        padding-left: 6px;
        display: inline-block;
        background-color: lavender;
    }
    input {
        font-family: inherit;
        font-size: inherit;
        -webkit-padding: 0.4em 0;
        padding: 0.4em;
        margin: 0 0 0.5em 0;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 2px;
    }

    input:disabled {
        color: #ccc;
    }
    #main {
        overflow: auto;
    }
    .header-top {
        padding: 20px;
    }
    .header-top > h2 {
        text-align: center;
        margin: 0px;
        text-transform: uppercase;
    }
    hr {
        margin: 0px;
    }
    .body {
        padding: 20px;
    }
    .one-input {
        margin-bottom: 10px;
    }
    .one-input > p {
        margin: 0px;
        text-transform: capitalize;
    }
</style>
