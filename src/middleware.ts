import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const protectedRoutes = ['/', '/upload', '/embeddings'];

const onlyPublicRoutes = ['/signin', '/signup'];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userId = request.cookies.get('user_id')?.value;

  const isAuthenticated = Boolean(userId);

  if (protectedRoutes.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (onlyPublicRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
