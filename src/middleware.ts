import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

// The standalone login page URL (kept out of /admin for obscurity).
const LOGIN_PATH = "/secure-portal";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("admin-session")?.value;
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    let isValid = false;
    if (session) {
      try {
        await jwtVerify(session, secretKey);
        isValid = true;
      } catch {
        isValid = false;
      }
    }

    if (!isValid) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
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
