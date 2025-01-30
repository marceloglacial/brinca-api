import db from '@/config/firestore';
import { getAllDocs, getDocBySlug, getDocumentById } from '@/services';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from '@firebase/firestore';

export async function GET(_request: Request, { params }: { params: { slug: string[] } }) {
    const collectionName = params.slug[0]
    const queryType = params.slug[1]
    const documentId = params.slug[2]
    const url = new URL(_request.url);
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 100;


    if (!queryType) return getAllDocs(collectionName, limit)
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
        const dataToAdd = {
            ...data,
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        const docRef = await addDoc(collection(db, collectionName), dataToAdd)

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

        if (!document.data()) throw {
            message: 'Document not found'
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
            message: 'Document not deleted',
            error: { ...e }
        };
        return new Response(JSON.stringify(result), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
    try {
        const collectionName = params.slug[0]
        const documentId = params.slug[1]
        const docRef = doc(db, collectionName, documentId)
        const document = await getDoc(docRef);

        if (!document.data()) throw {
            message: 'Document not found'
        }
        const data = await request.json();
        const updatedData = {
            ...data,
            updatedAt: new Date().toISOString()
        }
        await updateDoc(docRef, updatedData)
        const result: IResponse = {
            status: 'success',
            message: 'Document successfully updated',
        }
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        const result: IResponse = {
            status: 'error',
            message: 'Document not updated',
            error: { ...e }
        };
        return new Response(JSON.stringify(result), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
