import { getPages } from '@/services';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const locale = url.searchParams.get('language');
        const result = await getPages(locale)
        return Response.json(result);
    } catch (e) {
        const result = {
            status: 'error',
            message: e
        };
        return Response.json(result);
    }
}
