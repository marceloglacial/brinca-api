import { getPageBySlug } from '@/services';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
    try {
        const result = await getPageBySlug(params.slug)
        return Response.json(result);
    } catch (e) {
        const result = {
            status: 'error',
            message: e
        };
        return Response.json(result);
    }
}
