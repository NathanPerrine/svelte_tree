// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable, type Readable, derived } from 'svelte/store';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQENduPKuZCtsyJADP7FBbl6fFqV-nMKU",
  authDomain: "sveltetree-e2035.firebaseapp.com",
  projectId: "sveltetree-e2035",
  storageBucket: "sveltetree-e2035.appspot.com",
  messagingSenderId: "505320391446",
  appId: "1:505320391446:web:ac4bbac04e234b2040c637"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

/**
 * @returns a store with the current firebase user
 */
function userStore() {
    let unsubscribe: () => void;

    if (!auth || !globalThis.window) {
        console.warn('Auth is not initialized or not in browser');
        const { subscribe } = writable<User | null>(null);
        return {
            subscribe
        }
    }

    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            set(user);
        })

        return () => unsubscribe();
    })

    return {
        subscribe,
    }
}

export const user = userStore();

/**
 * @param {string} path document path or reference
 * @param {any} startWith optional default data
 * @returns a store with realtime updates on document data
 */
export function docStore<T>(
    path: string,
) {
    let unsubscribe: () => void;
    const docRef = doc(db, path);

    const { subscribe } = writable<T | null>(null, (set) => {
        unsubscribe = onSnapshot(docRef, (snapshot) => {
            set((snapshot.data() as T) ?? null);
        });

        return () => unsubscribe();
    });

    return {
        subscribe,
        ref: docRef,
        id: docRef.id,
    };
}

interface UserData {
    username: string;
    bio: string;
    photoURL: string;
    published: boolean;
    links: any[];
}

export const userData: Readable<UserData | null> = derived(user, ($user, set) => {
    if ($user) {
        return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null);
    }
});