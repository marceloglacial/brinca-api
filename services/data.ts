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

const handleDataRequest = async <T>(
  requestFunction: (req: any) => Promise<ApiResponse<T>>,
  request: ApiRequest | DataByIdApiRequest | DataBySlugApiRequest
) => {
  try {
    const response = await requestFunction(request);
    return createResponse(response, 200);
  } catch (e: any) {
    return errorResponse(e.message);
  }
}

export const getData = (request: DataApiRequest) => {
  return handleDataRequest<any[]>(getCollectionById, request);
};

export const getDataBySlug = (request: DataBySlugApiRequest) =>
  handleDataRequest<any>(getDocumentBySlug, request);

export const getDataById = (request: DataByIdApiRequest) =>
  handleDataRequest<any>(getDocumentById, request);
