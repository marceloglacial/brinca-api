import { getPages } from '@/services';

export async function GET(_request: Request) {
    const url = new URL(_request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    return await getPages({
        collectionId: 'pages',
        ...searchParams
    })
}
