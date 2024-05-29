import db from '@/config/firestore';
import { formatDocs } from '@/services';
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, limit, orderBy, query, where } from '@firebase/firestore';

export async function GET(_request: Request, { params }: { params: { slug: string[] } }) {
    const collectionName = params.slug[0]
    const queryType = params.slug[1]
    const documentId = params.slug[2]

    if (!queryType) return getAllDocs(collectionName)
    if (queryType === 'id') {
        return await getDocumentById(collectionName, documentId)

    } else {
        return getDocBySlug(collectionName, queryType, documentId)
    }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
    try {
        const collectionName = params.slug[0]
        const data = await request.json();
        const docRef = await addDoc(collection(db, collectionName), data)

        const result: IResponse = {
            status: 'success',
            message: 'Document successfully created',
            id: docRef.id
        };
        return new Response(JSON.stringify(result), {
            status: 200,
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

export async function DELETE(_request: Request, { params }: { params: { slug: string } }) {
    try {
        const collectionName = params.slug[0]
        const documentId = params.slug[1]
        const docRef = doc(db, collectionName, documentId)
        const document = await getDoc(docRef);

        if (!document.data()) {
            const result: IResponse = {
                status: 'error',
                message: 'Document not found',
            };
            return new Response(JSON.stringify(result), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await deleteDoc(docRef)

        const result: IResponse = {
            status: 'success',
            message: 'Document successfully deleted',
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


const getDocumentById = async (collectionName: string, id: string) => {
    try {
        const docRef = doc(db, collectionName, id);
        const document = await getDoc(docRef);

        if (!document.data()) {
            const result: IResponse = {
                status: 'error',
                message: 'Document not found',
            };
            return new Response(JSON.stringify(result), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
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
            message: e.message,
            error: { ...e }
        };
        return new Response(JSON.stringify(result), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

const getAllDocs = async (collectionName: string) => {
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

const getDocBySlug = async (collectionName: string, locale: string, slug: string) => {
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
