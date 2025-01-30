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
        let paginatedQuery = query(orderedQuery, limit(pageSize));

        if (page > 1) {
            const previousPageQuery = query(orderedQuery, limit((page - 1) * pageSize));
            const previousPageSnapshot = await getDocs(previousPageQuery);

            if (!previousPageSnapshot.empty) {
                const lastVisible = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
                paginatedQuery = query(orderedQuery, startAfter(lastVisible), limit(pageSize));
            }
        }

        const querySnapshot = await getDocs(paginatedQuery);
        const totalCountQuery = await getDocs(collectionRef);
        const totalCount = totalCountQuery.size;
        const totalPages = Math.ceil(totalCount / pageSize)
        const hasNextPage = totalPages > page

        return {
            status: 'success',
            message: `Successfully retrieved ${collectionId} collection`,
            meta: { ...defaultMeta, page, pageSize, totalCount, totalPages, hasNextPage },
            data: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        };
    } catch (e) {
        return {
            status: 'error',
            message: `Failed to retrieve ${collectionId} collection`,
            data: null,
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
