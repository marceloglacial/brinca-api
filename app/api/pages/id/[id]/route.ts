import { getSinglePageById } from '@/services';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    return await getSinglePageById({
        documentId: params.id
    })
}
