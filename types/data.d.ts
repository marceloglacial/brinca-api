interface ParamsProps {
    slug?: string
    locale: string
    id?: string
}

interface PageProps {
    children?: React.ReactNode;
    params: ParamsProps;
}

interface DocumentData {
    createdAt?: Timestamp;
    title?: string;
    content: string;
    updatedAt?: Timestamp;
    slug: string;
    publishedAt?: Timestamp;
    locale: string;
    id?: string;
    parent?: ParamsProps['slug']
    image?: HTMLImageElement
}


interface ResponseProps {
    status: 'success' | 'error'
    data: PageDocumentData[]
    error?: any
}
