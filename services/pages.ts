import { getCollectionById, getDocumentById, getDocumentBySlug } from './firebase';

const createResponse = (data: any, status: 200 | 500) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

const errorResponse = (message: string) => {
  const result: ApiResponse<null> = {
    status: 'error',
    message,
    data: null,
  };
  return createResponse(result, 500);
}

const handlePageRequest = async <T>(
  requestFunction: (req: any) => Promise<ApiResponse<T>>,
  request: PagesApiRequest | SinglePageByIdApiRequest | SinglePageBySlugApiRequest
) => {
  try {
    const response = await requestFunction(request);
    return createResponse(response, 200);
  } catch (e: any) {
    return errorResponse(e.message);
  }
}

export const getPages = (request: PagesApiRequest) =>
  handlePageRequest<any[]>(getCollectionById, request);

export const getSinglePageBySlug = (request: SinglePageBySlugApiRequest) =>
  handlePageRequest<any>(getDocumentBySlug, request);

export const getSinglePageById = (request: SinglePageByIdApiRequest) =>
  handlePageRequest<any>(getDocumentById, request);
