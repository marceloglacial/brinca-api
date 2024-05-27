import db from "@/config/firestore"
import { LOCALES } from '@/constants';
import { Query, Timestamp, addDoc, collection, getDocs, query, where } from "firebase/firestore"

export interface PageDocumentData {
    createdAt?: Timestamp;
    title?: string;
    content: string;
    updatedAt?: Timestamp;
    slug: string;
    publishedAt?: Timestamp;
    locale: string;
    id?: string;
    parent?: PageParamsProps['slug']
    image?: HTMLImageElement
}


export interface DataResponseProps {
    status: 'success' | 'error'
    data: PageDocumentData[]
    error?: any
}

const formatDocs = async (query: Query) => {
    const querySnapshot = await getDocs(query);
    const results: PageDocumentData[] = querySnapshot.docs.map(doc => ({
        ...(doc.data() as PageDocumentData),
        id: doc.id
    }));
    return results

}

export const getPages = async (locale?: string | null): Promise<DataResponseProps> => {
    try {
        const colRef = collection(db, 'pages');
        const q = query(colRef, where("locale", "==", locale || LOCALES.DEFAULT));
        return {
            status: 'success',
            data: await formatDocs(q)
        };
    } catch (e) {
        throw (e);
    }
};

export const getPageBySlug = async (slug?: string): Promise<DataResponseProps> => {
    try {
        const colRef = collection(db, 'pages');
        const q = query(colRef, where("slug", "==", slug));
        return {
            status: 'success',
            data: await formatDocs(q)
        };
    } catch (e) {
        throw (e);
    }
};

export const addPage = async (pageData: PageDocumentData): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'pages'), pageData);
        return docRef.id;
    } catch (error) {
        console.log(error);

        throw error;
    }
};
