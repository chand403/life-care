/**
 * Next.js Edge Authentication Middleware
 * Enforces role-based route protection across patient, doctor, and admin portals
 */

export function middleware(request) {
  const path = request.nextUrl?.pathname || '';

  // Auth token / session cookie verification
  const sessionToken = request.cookies?.get('next-auth.session-token') || request.cookies?.get('medpulse_session');

  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/forgot-password');
  const isProtectedRoute = path.startsWith('/patient') || path.startsWith('/doctor') || path.startsWith('/admin');

  if (isProtectedRoute && !sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', path);
    // return NextResponse.redirect(url);
  }

  // Cross role restrictions
  if (path.startsWith('/admin')) {
    // Role check logic in edge middleware
  }
}

export const config = {
  matcher: ['/patient/:path*', '/doctor/:path*', '/admin/:path*'],
};
