<script lang="ts">
    import { db, user } from "$lib/firebase";
    import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";
    import MingcuteInformationLine from '~icons/mingcute/information-line'

    const icons = ["Twitter", "YouTube", "TikTok", "LinkedIn", "GitHub", "Custom"];

    const formDefaults = {
        icon: "custom",
        title: "",
        url: "https://",
        id: ""
    };

    const formData = writable(formDefaults);

    export let showForm: string | boolean;
    export let editLinkItem: any = null;

    $: if(showForm ==='edit'){
        setEdit()
    }

    function setEdit() {
        $formData = {...editLinkItem}
    }

    $: urlIsValid = $formData.url.match(/^((https?|ftp|smtp):\/\/)?(www.)?([\w].?)+\.[a-z]+(\/[a-zA-Z0-9#?=]+\/?)*$/);
    $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;

    async function addLink(e: SubmitEvent) {
        const userRef = doc(db, "users", $user!.uid)

        if (formIsValid){
            if(showForm === 'addLink'){
                await updateDoc(userRef, {
                    links: arrayUnion({
                        ...$formData,
                        id: Date.now().toString(),
                    }),
                });
            }

            if(showForm === 'edit'){
                console.log(editLinkItem, 'editLinkItem')
                console.log($formData, 'formData')

                await updateDoc(userRef, {
                    links:  arrayRemove({
                        ...editLinkItem
                    })
                })

                await updateDoc(userRef, {
                    links: arrayUnion({
                        ...$formData,
                    })
                })
            }

            formData.set(formDefaults);
            showForm = false;

        }
    }

    function cancelLink() {
        formData.set(formDefaults);
        showForm = false;
        editLinkItem = null
    }

</script>

<form on:submit|preventDefault={addLink} class="bg-base-200 p-6 w-full mx-auto rounded-xl">
    <div class="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2">
        <div>
            <div>
                {#if showForm === 'addLink'}
                <h1 class="mx-2 text-2xl font-bold mb-4 text-center">Add new link</h1>
                {:else if showForm === 'edit'}
                <h1 class="mx-2 text-2xl font-bold mb-4 text-center">Edit link</h1>
                {/if}
            </div>

            <div class="flex ">
                <select name="icon" class="select select-sm" bind:value={$formData.icon}>
                {#each icons as icon}
                    <option value={icon.toLowerCase()}>{icon}</option>
                {/each}
                </select>

                <input name="title" type="text" placeholder="Title" class="input input-sm" bind:value={$formData.title} />
                <input name="url" type="text" placeholder="URL" class="input input-sm" bind:value={$formData.url} />
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
        </div>
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

    <button disabled={!formIsValid} type="submit" class="btn btn-success block">
        {#if showForm === 'addLink'}
        Add Link
        {:else if showForm === 'edit'}
        Edit Link
        {/if}
    </button>
    <button type="button" class="btn btn-xs my-4" on:click={cancelLink}>Cancel</button>
</form>