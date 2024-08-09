import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const allowedOrigins = ['http://localhost:3000', 'https://brinca.ca', 'https://brinca-admin.vercel.app'];

    const origin = req.headers.get('origin');

    if (origin && allowedOrigins.includes(origin)) {
        return NextResponse.next();
    }

    return new NextResponse('Not allowed', { status: 403 });
}

export const config = {
    matcher: '/:path*',
};
