import db from "@/config/firestore"
import { Query, collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore"

export const formatDocs = async (query: Query) => {
    const querySnapshot = await getDocs(query);
    const results: IDocumentData[] = querySnapshot.docs.map(doc => ({
        ...(doc.data() as IDocumentData),
        id: doc.id
    }));
    return results
}

export const getDocumentById = async (collectionName: string, id: string) => {
    try {
        const docRef = doc(db, collectionName, id);
        const document = await getDoc(docRef);

        if (!document.data()) throw {
            message: 'Document not found'
        }

        const result: IResponse = {
            status: 'success',
            message: 'Document successfully loaded',
            data: document.data(),
        }
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        const result: IResponse = {
            status: 'error',
            message: 'Document not loaded',
            error: { ...e }
        };
        return new Response(JSON.stringify(result), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export const getAllDocs = async (collectionName: string) => {
    try {
        const coll = collection(db, collectionName);
        const q = query(coll, orderBy("publishedAt", "desc"), limit(10));

        const snapshot = await getCountFromServer(q);
        const documents = await formatDocs(q)
        const result: IPageResponse = {
            status: 'success',
            message: 'Documents successfully listed',
            total: snapshot.data().count,
            data: documents,
        }
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        const result: IResponse = {
            status: 'error',
            message: e.message,
            error: { ...e }
        };
        return new Response(JSON.stringify(result), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

}

export const getDocBySlug = async (collectionName: string, locale: string, slug: string) => {
    try {
        const coll = collection(db, collectionName);
        const q = query(coll, where(`slug.${locale}`, "==", slug));
        const documents = await formatDocs(q)

        const result: IResponse = {
            status: 'success',
            message: 'Documents successfully listed',
            data: documents[0],
        }
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        const result: IResponse = {
            status: 'error',
            message: 'Invalid endpoint',
            error: { ...e, message: e.message }
        };
        return new Response(JSON.stringify(result), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
