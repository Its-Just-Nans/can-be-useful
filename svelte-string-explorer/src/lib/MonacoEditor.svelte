<script>
    import { onMount } from "svelte";
    import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
    import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
    import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
    import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
    import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
    import { codePointStore, myString } from "./stores";

    let divEl;
    let editor;

    onMount(async () => {
        self.MonacoEnvironment = {
            getWorker: function (_moduleId, label) {
                if (label === "json") {
                    return new jsonWorker();
                }
                if (label === "css" || label === "scss" || label === "less") {
                    return new cssWorker();
                }
                if (label === "html" || label === "handlebars" || label === "razor") {
                    return new htmlWorker();
                }
                if (label === "typescript" || label === "javascript") {
                    return new tsWorker();
                }
                return new editorWorker();
            },
        };

        let Monaco = await import("monaco-editor");
        editor = Monaco.editor.create(divEl, {
            value: $myString,
            theme: "vs-dark",
        });
        codePointStore.subscribe((value) => {
            if (value) {
                const model = editor.getModel();
                const str = String.fromCodePoint(value);
                const range = model.findMatches(str);
                if (range) {
                    editor.setSelection(range[0].range);
                    editor.getAction("actions.find").run();
                }
            }
        });
        editor.onDidChangeModelContent(() => {
            const text = editor.getValue();
            $myString = text;
        });
        return () => {
            editor.dispose();
        };
    });
</script>

<div class="flex-grow">
    <div bind:this={divEl} id="container" />
</div>
<svelte:window
    on:resize={() => {
        editor.layout({ width: 0, height: 0 });
        window.requestAnimationFrame(() => {
            const rect = divEl.parentElement.getBoundingClientRect();
            editor.layout({ width: rect.width, height: rect.height });
        });
    }}
/>

<style>
    #container {
        flex-grow: 1;
        height: 500px;
        width: 100%;
    }
</style>
