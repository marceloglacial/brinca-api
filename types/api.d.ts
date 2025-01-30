type Status = "success" | "error"

type Meta = {
    totalCount: number,
    page: number,
    pageSize: number,
    hasNextPage: boolean,
    totalPages: number
}

type ApiResponse<T> = {
    data: T,
    status: Status,
    message: string,
    meta?: Meta
}


interface ApiRequest {
    order?: 'asc' | 'desc';
    orderBy?: string;
    page?: number;
    pageSize?: number;
}

interface PagesApiRequest extends ApiRequest {
    collectionId: string,
}

interface SinglePageBySlugApiRequest {
    collectionId: string;
    slug: string;
    locale: string;
}

interface SinglePageByIdApiRequest {
    collectionId: string;
    documentId: string;
}
