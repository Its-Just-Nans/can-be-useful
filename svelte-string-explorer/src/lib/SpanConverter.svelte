<script lang="ts">
    import { getByteOfCodePoint, getColorOfCodePoint } from "./lib";
    import { optionsConverter, codePointStore } from "./stores";

    export let codePoint = 0;
    const bytes = getByteOfCodePoint(codePoint);
    let value = "";
    for (const oneByte of bytes) {
        value += `${$optionsConverter.prefix}${oneByte
            .toString($optionsConverter.base)
            .padStart($optionsConverter.padding, "0")}${$optionsConverter.spacing}`;
    }
    let show = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span
    class="text-span"
    data-tooltip={`string: ${String.fromCodePoint(codePoint)}
    decimal: ${codePoint}
    binary: ${codePoint.toString(2).padStart(8, "0")}
    hex: ${codePoint.toString(16).toUpperCase().padStart(2, "0")}`}
    style={`background-color:${getColorOfCodePoint(codePoint)}`}
    on:click={() => {
        $codePointStore = codePoint;
    }}>{value}</span
>
<svelte:head>
    <style>
        /*This would all go into the global.css file*/
        [data-tooltip] {
            position: relative;
            z-index: 2;
        }

        [data-tooltip]:before,
        [data-tooltip]:after {
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
            transition: 0.2s ease-out;
            transform: translate(-50%, 5px);
        }

        [data-tooltip]:before {
            position: absolute;
            bottom: 100%;
            left: 50%;
            margin-bottom: 5px;
            padding: 7px;
            width: 100%;
            min-width: 70px;
            max-width: 250px;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            background-color: #000;
            background-color: hsla(0, 0%, 20%, 0.9);
            color: #fff;
            content: attr(data-tooltip);
            text-align: center;
            font-size: 14px;
            line-height: 1.2;
            transition: 0.2s ease-out;
            white-space: pre-line;
        }

        [data-tooltip]:after {
            position: absolute;
            bottom: 100%;
            left: 50%;
            width: 0;
            border-top: 5px solid #000;
            border-top: 5px solid hsla(0, 0%, 20%, 0.9);
            border-right: 5px solid transparent;
            border-left: 5px solid transparent;
            content: " ";
            font-size: 0;
            line-height: 0;
        }

        [data-tooltip]:hover:before,
        [data-tooltip]:hover:after {
            visibility: visible;
            opacity: 1;
            transform: translate(-50%, 0);
        }
        [data-tooltip="false"]:hover:before,
        [data-tooltip="false"]:hover:after {
            visibility: hidden;
            opacity: 0;
        }
    </style>
</svelte:head>

<style>
    .text-span {
        cursor: pointer;
    }
</style>
