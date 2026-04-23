import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Middleware — protección de rutas.
 * Redirige a /login con callbackUrl si el usuario no tiene sesión.
 */
export default auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/perfil/:path*', '/mis-pedidos/:path*'],
};
