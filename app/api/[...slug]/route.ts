import { getData, getDataById, getDataBySlug } from '@/services';

export async function GET(_request: Request, { params }: { params: { slug: string[] } }) {

    const [collectionId, second, third] = params.slug;

    switch (second) {
        case 'id':
            return await getDataById({
                collectionId,
                documentId: third
            });

        case undefined:
            const url = new URL(_request.url);
            const searchParams = Object.fromEntries(url.searchParams.entries());
            return await getData({
                collectionId,
                ...searchParams
            });

        default:
            return await getDataBySlug({
                collectionId,
                locale: second,
                slug: third
            });
    }
}
