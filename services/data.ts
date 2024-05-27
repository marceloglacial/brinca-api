import db from "@/config/firestore"
import { LOCALES } from '@/constants';
import { Query, collection, getDocs, query, where } from "firebase/firestore"

const formatDocs = async (query: Query) => {
    const querySnapshot = await getDocs(query);
    const results: DocumentData[] = querySnapshot.docs.map(doc => ({
        ...(doc.data() as DocumentData),
        id: doc.id
    }));
    return results

}

export const getData = async (collectionName: string, locale?: string | null): Promise<ResponseProps> => {
    try {
        const colRef = collection(db, collectionName);
        const q = locale ? query(colRef, where("locale", "==", locale)) : colRef;
        const hasDocs = await getDocs(q);

        if (hasDocs.empty) {
            throw new Error(`Collection '${collectionName}' does not exist or is empty.`);
        }

        return {
            status: 'success',
            data: await formatDocs(q)
        };
    } catch (e: any) {
        return {
            status: 'error',
            data: [],
            error: e.message || 'An error occurred while fetching data.'
        };
    }
};

export const getDataBySlug = async (collectionName: string, slug?: string): Promise<ResponseProps> => {
    try {
        const colRef = collection(db, collectionName);
        const q = query(colRef, where("slug", "==", slug));
        return {
            status: 'success',
            data: await formatDocs(q)
        };
    } catch (e) {
        throw (e);
    }
};
