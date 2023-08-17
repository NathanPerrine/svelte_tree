<script lang="ts">
    import { page } from "$app/stores";
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import SortableList from "$lib/components/SortableList.svelte";
    import UserLink from "$lib/components/UserLink.svelte";
    import { db, userData, user } from "$lib/firebase";
    import { arrayRemove, doc, setDoc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";
    import LinkForm from "$lib/components/LinkForm.svelte";

    let showForm: string | boolean = false;
    let editLinkItem: any = null

    function sortList(e: CustomEvent) {
        const newList = e.detail;
        const userRef = doc(db, "users", $user!.uid);
        setDoc(userRef, { links: newList }, { merge: true });
    }

    async function editLink(item: any) {
        editLinkItem = item;
        showForm = 'edit'
    }

    async function deleteLink(item: any) {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            links: arrayRemove(item),
        });
    }

</script>

<main class="max-w-xl mx-auto">
    {#if $userData?.username == $page.params.username}
        <h1 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">
        Edit your Profile
        </h1>

        <SortableList list={$userData?.links} on:sort={sortList} let:item let:index>
            <div class="group relative">
                <UserLink {...item} />
                <button on:click={() => deleteLink(item)} class="btn-xs btn-error invisible group-hover:visible transition-all absolute -right-6 bottom-10 rounded">Delete</button>
                <button on:click={() => editLink(item)} class ="btn-xs btn-success invisible group-hover:visible transition-all absolute -left-6 bottom-10 rounded">Edit</button>
            </div>
        </SortableList>

        {#if showForm === 'addLink'}
        <LinkForm bind:showForm />

        {:else}
        <button on:click={() => (showForm = 'addLink')} class="btn btn-outline btn-info block mx-auto my-4">
            Add a Link
        </button>
        {/if}

        {#if showForm === 'edit'}
            <LinkForm bind:showForm bind:editLinkItem />
        {/if}
    {/if}
</main>