import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimistic auth check via cookies — no network call.
  // getClaims()/getUser() in the proxy causes timeouts on HS256 JWT projects
  // (Supabase default). Actual JWT validation happens in each protected layout
  // and server action via getUser().
  const isAuthenticated = request.cookies
    .getAll()
    .some((c) => c.name.includes("-auth-token") && c.value);

  const protectedRoutes = [
    "/journals",
    "/newsletters",
    "/settings",
    "/profile",
  ];

  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/journals", request.url));
  }

  if (!isAuthenticated && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next({ request });
}
