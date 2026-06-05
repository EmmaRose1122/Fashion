import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("admin-session")?.value;
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // If path is under /admin
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    let isValid = false;
    if (session) {
      try {
        await jwtVerify(session, secretKey);
        isValid = true;
      } catch {
        isValid = false;
      }
    }

    // Not logged in but trying to access admin pages -> redirect to login
    if (!isValid && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Already logged in but trying to access login page -> redirect to dashboard
    if (isValid && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
