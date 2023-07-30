<script>
    import { page } from '$app/stores';
    import { fly } from 'svelte/transition';
</script>

{#key $page.url}
    <div in:fly={{ delay: 501, x:'-100%', duration: 500 }} out:fly={{ x:'100%', duration: 500 }}>
        <slot />
    </div>
{/key}
