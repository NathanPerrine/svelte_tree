import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FB_PROJECT_ID, FB_CLIENT_EMAIL, FB_PRIVATE_KEY } from '$env/static/private';
import pkg from 'firebase-admin';

try {
    pkg.initializeApp({
        credential: pkg.credential.cert({
            projectId: FB_PROJECT_ID,
            clientEmail: FB_CLIENT_EMAIL,
            privateKey: FB_PRIVATE_KEY
        }),
    });
} catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    if (!/already exists/u.test(message)) {
        console.error('Firebase Admin Error: ', error);
    }
}

export const adminDB = getFirestore();
export const adminAuth = getAuth();

