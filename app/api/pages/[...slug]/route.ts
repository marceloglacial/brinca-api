import db from '@/config/firestore';
import { formatDocs } from '@/services';
import { collection, query, where } from '@firebase/firestore';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
    try {
        const coll = collection(db, 'pages');
        const q = query(coll, where(`slug.${params.slug[0]}`, "==", params.slug[1]));
        const documents = await formatDocs(q)
        const result: IPageResponse = {
            status: 'success',
            message: 'Document successfully loaded',
            total: 0,
            data: documents,
        }
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify(e), {
            status: 500,
        });
    }
}
