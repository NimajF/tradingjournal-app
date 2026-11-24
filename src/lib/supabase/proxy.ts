import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedRoutes = ["/journals", "/newsletters", "/settings", "/profile"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  let supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Mutate the requests cookies so that the next middleware/route sees the updated cookies.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // 2. Reconstruct the response with the mutated req, then set the cookies on the response so that the client sees the updated cookies.
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  const { pathname } = request.nextUrl;
  const { data, error } = await supabase.auth.getClaims();

  if (error?.code === "refresh_token_already_used") {
    // If the refresh token has already been used, signout user and clear session.
    await supabase.auth.signOut();
  }

  const isAuthenticated = !!data?.claims;

  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/journals", request.url));
  }

  if (!isAuthenticated && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}
