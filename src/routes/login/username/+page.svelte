<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { db, user, userData } from "$lib/firebase";
    import { doc, getDoc, writeBatch } from "firebase/firestore";

    let username = "";
    let loading = false;
    let isAvailable = false;
    let debounceTimer: NodeJS.Timeout;

    async function checkAvailability() {
        isAvailable = false;
        loading = true;
        clearTimeout(debounceTimer)

        if(username?.length > 2 && username.length < 16 && re.test(username)){
            debounceTimer = setTimeout(async () => {
                console.log('Checking availability of ', username);

                const ref = doc(db, "usernames", username);
                const exists = await getDoc(ref).then((doc) => doc.exists());

                isAvailable = !exists;
                loading = false;
            }, 500);
        }
    }

    async function confirmUsername() {
        console.log('Confirming username.. ', username);
        const batch = writeBatch(db);
        batch.set(doc(db, "usernames", username), { uid: $user?.uid });
        batch.set(doc(db, "users", $user!.uid), {
            username,
            photoURL: $user?.photoURL ?? null,
            published: true,
            bio: 'I am the Walrus',
            links: [
                {
                    title: 'Test Link',
                    url: 'https://kung.foo',
                    icon: 'custom'
                }
            ]
        });

        await batch.commit();

        username='';
        isAvailable = false;
    }

    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
    $: isTouched = username.length > 0;
    $: isTaken = isValid && !isAvailable && !loading;

</script>

<AuthCheck>
    {#if $userData?.username}
        <p class="text-lg">Your username is <span class="text-success font-bold">@{$userData.username}</span></p>
        <p class="text-sm">(Usernames cannot be changed)</p>
        <a href="/login/photo" class="btn btn-primary">Upload Profile Image</a>
    {:else}
    <h2>Username</h2>
    <form class='w-2/5' on:submit|preventDefault={confirmUsername}>
        <input
            type='text'
            placeholder="Username"
            class='input w-full my-3'
            bind:value={username}
            on:input={checkAvailability}
            class:input-error={(!isValid && isTouched)}
            class:input-warning={isTaken}
            class:input-success={isAvailable && isValid && !loading}
        />
        {#if loading && isValid}
            <p class="text-secondary">Checking availability of @{username}...</p>
        {/if}

        {#if !isValid && isTouched}
            <p class="text-error text-sm">Must be 3-16 characters long, alphanumeric only.</p>
        {/if}

        {#if isValid && !isAvailable && !loading}
            <p class="text-warning text-sm my-2">@{username} is not available</p>
        {/if}

        {#if isAvailable && isValid}
            <button class='btn btn-success normal-case my-2'>Confirm username @{username}</button>
        {/if}
    </form>
    {/if}
</AuthCheck>