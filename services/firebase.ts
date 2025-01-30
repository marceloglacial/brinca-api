import { initializeApp, getApps, getApp } from 'firebase/app'
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export const storage = getStorage(app)
export const db = getFirestore(app)

export interface GetCollectionsByIdProps {
    collectionId: string;
    order?: 'asc' | 'desc';
    orderBy?: string;
    page?: number;
    pageSize?: number;
}

export interface GetDocmentBySlugProps {
    collectionId: string;
    slug: string;
    locale: string;
}

export interface GetDocumentByIdProps {
    collectionId: string;
    documentId: string;
}

const defaultMeta: Meta = {
    totalCount: 0,
    page: 0,
    pageSize: 0,
    hasNextPage: false,
    totalPages: 0
};

export const getCollectionById = async ({
    collectionId,
    order,
    page = 1,
    pageSize = 100
}: GetCollectionsByIdProps): Promise<ApiResponse<any>> => {
    try {
        const collectionRef = collection(db, collectionId);
        const orderedQuery = order ? query(collectionRef, orderBy(order)) : collectionRef;
        const paginatedQuery = query(orderedQuery, limit(pageSize));
        const querySnapshot = await getDocs(paginatedQuery);

        return {
            status: 'success',
            message: `Successfully retrieved ${collectionId} collection`,
            data: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            meta: { ...defaultMeta, page, pageSize }
        };
    } catch (e) {
        return {
            status: 'error',
            message: `Failed to retrieve ${collectionId} collection`,
            data: null,
            meta: defaultMeta,
        };
    }
};

export const getDocumentBySlug = async ({
    collectionId,
    slug,
    locale
}: GetDocmentBySlugProps): Promise<ApiResponse<any>> => {
    try {
        const q = query(
            collection(db, collectionId),
            where(`slug.${locale}`, "==", slug)
        );
        const doc = (await getDocs(q)).docs[0];

        return {
            status: doc ? 'success' : 'error',
            message: doc
                ? `Successfully retrieved document with slug "${slug}"`
                : `Document with slug "${slug}" not found`,
            data: doc ? { id: doc.id, ...doc.data() } : null,
            meta: defaultMeta
        };
    } catch (e) {
        return {
            status: 'error',
            message: `Failed to retrieve document with slug "${slug}"`,
            data: null
        };
    }
};

export const getDocumentById = async ({
    collectionId,
    documentId
}: GetDocumentByIdProps): Promise<ApiResponse<any>> => {
    try {
        const docRef = doc(collection(db, collectionId), documentId);
        const docSnapshot = await getDoc(docRef);

        return {
            status: docSnapshot.exists() ? 'success' : 'error',
            message: docSnapshot.exists()
                ? `Successfully retrieved document with ID "${documentId}"`
                : `Document with ID "${documentId}" not found`,
            data: docSnapshot.exists() ? { id: docSnapshot.id, ...docSnapshot.data() } : null,
        };
    } catch (e) {
        return {
            status: 'error',
            message: `Failed to retrieve document with ID "${documentId}"`,
            data: null
        };
    }
};
