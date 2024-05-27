import { getData, getDataBySlug } from '@/services';

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
    try {
        const url = new URL(request.url);
        const locale = url.searchParams.get('locale');
        const result = params.slug[1] ? await getDataBySlug(params.slug[0], params.slug[1]) : await getData(params.slug[0], locale)
        return Response.json(result);
    } catch (e) {
        const result = {
            status: 'error',
            message: e
        };
        return Response.json(result);
    }
}

// const newPageData = {
//     title: "New Page Title",
//     content: "Page content goes here",
//     slug: "new-page",
//     locale: "en"
// };

// export async function POST(_request: Request) {
//     try {
//         await addPage(newPageData);
//     } catch (e) {
//         const result = {
//             status: 'error',
//             message: e
//         };
//         return Response.json(result);
//     }
// }
