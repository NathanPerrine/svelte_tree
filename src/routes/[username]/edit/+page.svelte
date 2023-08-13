<script lang="ts">
    import { page } from "$app/stores";
    import UserLink from "$lib/components/UserLink.svelte";
    import { db, userData, user } from "$lib/firebase";
    import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";
    import MingcuteInformationLine from '~icons/mingcute/information-line'

    const icons = ["Twitter", "YouTube", "TikTok", "LinkedIn", "GitHub", "Custom"];

    const formDefaults = {
        icon: "custom",
        title: "",
        url: "https://"
    };

    const formData = writable(formDefaults);

    let showForm = true;

    $: urlIsValid = $formData.url.match(/^((https?|ftp|smtp):\/\/)?(www.)?([\w].?)+\.[a-z]+(\/[a-zA-Z0-9#?=]+\/?)*$/);
    $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;

    async function addLink(e: SubmitEvent) {
        const userRef = doc(db, "users", $user!.uid)

        await updateDoc(userRef, {
            links: arrayUnion({
                ...$formData,
                id: Date.now().toString(),
            }),
        });

        formData.set({
            icon: "",
            title: "",
            url: "",
        });

        showForm = false;
    }

    async function deleteLink(item: any) {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            links: arrayRemove(item),
        });
    }

    function cancelLink() {
        formData.set(formDefaults);
        showForm = false;
    }

</script>

<main class="max-w-xl mx-auto">
    {#if $userData?.username == $page.params.username}
        <h1 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">
        Edit your Profile
        </h1>

        <!-- INSERT sortable list here -->

        {#if showForm}
        <form
            on:submit|preventDefault={addLink}
            class="bg-base-200 p-6 w-full mx-auto rounded-xl"
        >
            <div class="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2">
                    <select
                    name="icon"
                    class="select select-sm"
                    bind:value={$formData.icon}
                    >

                    {#each icons as icon}
                        <option value={icon.toLowerCase()}>{icon}</option>
                    {/each}
                    </select>

                    <input
                    name="title"
                    type="text"
                    placeholder="Title"
                    class="input input-sm"
                    bind:value={$formData.title}
                    />

                    <input
                    name="url"
                    type="text"
                    placeholder="URL"
                    class="input input-sm"
                    bind:value={$formData.url}
                    />
                    <label for="url" class="label justify-end">
                        <div class="group relative w-max">
                            <span class='text-info' class:text-success={urlIsValid}>
                                <MingcuteInformationLine class=' cursor-pointer' />
                            </span>
                            <span class="pointer-events-none opacity-0 group-hover:opacity-100">
                                <div class="text-xs absolute -top-10 -left-52 z-10 w-max bg-base-200 border-solid border-2 border-info p-4 rounded" class:border-success={urlIsValid}>
                                    <p>URLs must follow the following rules:</p>
                                    <p>Start with 'http://' or 'https://'</p>
                                    <p>May include 'www.'</p>
                                    <p>May have a subdomain</p>
                                    <p>Must have a second-level domain</p>
                                    <p>May include a subdomain</p>
                                    <p>May include a subdirectory</p>
                                </div>

                            </span>
                            </div>
                    </label>
            </div>
            <div class="my-4">
                <div class="swap cursor-default" class:swap-active={formIsValid}>
                    <div class="swap-on">
                        <p class="text-success text-xs">Looks good!</p>
                    </div>
                    <div class="swap-off">
                        <p class="text-info text-xs" class:text-success={titleIsValid}> Titles must be between 1 and 20 characters.</p>
                        <p class="text-info text-xs" class:text-success={urlIsValid}>URL must start with http(s) and follow the format https://www.google.com</p>
                    </div>
                </div>
            </div>

            <button
            disabled={!formIsValid}
            type="submit"
            class="btn btn-success block">Add Link</button
            >

            <button type="button" class="btn btn-xs my-4" on:click={cancelLink}>Cancel</button>
        </form>
        {:else}
        <button
            on:click={() => (showForm = true)}
            class="btn btn-outline btn-info block mx-auto my-4"
        >
            Add a Link
        </button>
        {/if}
    {/if}
</main>