type LocalizedString = {
    [k: string]: string
}

interface IDocumentData {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    publishedAt: Timestamp;
    pageType: string
}

interface IPageDocumentData extends IDocumentData {
    id: string;
    pageType: string
    title: LocalizedString;
    slug: LocalizedString;
    content: LocalizedString;
    image?: HTMLImageElement
}

interface IResponse {
    status: 'success' | 'error',
    message: string,
    id?: string | number
    error?: Error
    data?: any
}

interface IPageResponse extends IResponse {
    total: number
}
