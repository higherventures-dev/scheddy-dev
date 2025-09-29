// import { type NextRequest } from 'next/server'
// import { updateSession } from '@/utils/supabase/middleware'

// export async function middleware(request: NextRequest) {
//   return await updateSession(request)
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }
// /middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 1) Keep Supabase cookies fresh so server routes (incl. OAuth callback) can read the session
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  // 2) (Optional) Protect routes here. Comment out if you prefer page-level guards.
  // Absolute redirect avoids "middleware-relative-urls" error.
  const pathname = req.nextUrl.pathname;
  const protectedRoots = ["/dashboard", "/studio", "/admin"];
  const isProtected = protectedRoots.some(p => pathname === p || pathname.startsWith(p + "/"));

  if (isProtected) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const signin = new URL(
        `/auth/sign-in?next=${encodeURIComponent(pathname + req.nextUrl.search)}`,
        req.url
      );
      return NextResponse.redirect(signin);
    }
  }

  return res;
}

// Run on app + API, skip static assets/images
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

