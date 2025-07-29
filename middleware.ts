// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not logged in and trying to access protected route
  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}
// // middleware.ts
// import { updateSession } from '@/utils/supabase/middleware';
// import { type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     // Exclude static files and public assets
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// };

// // import { type NextRequest } from "next/server";
// // import { updateSession } from "@/utils/supabase/middleware";

// // export async function middleware(request: NextRequest) {
// //   return await updateSession(request);
// // }

// // export const config = {
// //   matcher: [
// //     /*
// //      * Match all request paths except:
// //      * - _next/static (static files)
// //      * - _next/image (image optimization files)
// //      * - favicon.ico (favicon file)
// //      * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
// //      * Feel free to modify this pattern to include more paths.
// //      */
// //     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
// //   ],
// // };
