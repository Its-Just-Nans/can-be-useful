<script lang="ts">
    export let index = 0;
    export let font: string;
    export let text: string;
    export let proxy: string;
    let style = `
<style>
    @font-face {
        font-family: customFont-${index};
        src: url('${proxy}${font}');
    }
    #element_${index} {
        font-family: customFont-${index};
    }
</style>`;
</script>

{@html style}
<a href={font}>
    <p id={`element_${index}`}>{text}</p>
</a>
