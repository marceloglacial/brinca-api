import db from '@/config/firestore';
import { formatDocs } from '@/services';
import { addDoc, collection, getCountFromServer, limit, query } from '@firebase/firestore';

export async function GET(_request: Request) {
    try {
        const coll = collection(db, 'menus');
        const q = query(coll, limit(10));
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

    } catch (e) {
        return new Response(JSON.stringify(e), {
            status: 500,
        });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const docRef = await addDoc(collection(db, 'pages'), data)

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
