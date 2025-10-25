<script>
    import OneArrow from "./OneArrow.svelte";
</script>

<div>
    <OneArrow name="ArrowLeft" />
    <OneArrow name="ArrowRight" />
    <OneArrow name="ArrowUp" />
    <OneArrow name="ArrowDown" />
</div>

<style>
    div {
        display: none;
        position: absolute;
        bottom: 0px;
        width: 100%;
        text-align: center;
        z-index: 10;
    }
    @media (max-width: 768px) {
        div {
            display: block;
        }
    }
</style>
