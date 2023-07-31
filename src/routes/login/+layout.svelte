<script lang="ts">
    import { page } from '$app/stores';
    import AnimatedRoute from '$lib/components/AnimatedRoute.svelte';
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    console.log('here ' + $page.route.id)
    console.log($page.route.id?.includes('login'))
</script>

<nav class='flex justify-center my-6'>
    <ul class="steps">
        <a href='/login' class='step step-primary'>Sign In</a>
        <a href='/login/username'
            class='step'
            class:step-primary={$page.route.id?.match(/username|photo/g)}
        >
        Choose Username
        </a>
        <a href='/login/photo'
            class='step'
            class:step-primary={$page.route.id?.includes('photo')}
        >
        Upload Photo
        </a>
    </ul>
</nav>

<AnimatedRoute>
    <main class='card w-4/6 bg-neutral text-neutral-content mx-auto'>
        <div class='card-body items-center text-center'>
            {#if $page.route.id?.match(/login$/) }
            <slot/>
            {:else}
            <AuthCheck>
                <slot/>
            </AuthCheck>
            {/if}
        </div>
    </main>
</AnimatedRoute>
