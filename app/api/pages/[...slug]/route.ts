import { getSinglePageBySlug } from '@/services';

export async function GET(_request: Request, { params }: { params: { slug: string[] } }) {
    return await getSinglePageBySlug({
        locale: params.slug[0],
        slug: params.slug[1]
    })
}
