import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export interface SessionPayload {
  email: string;
  role: "admin" | "editor";
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  const cookieStore = await cookies();
  cookieStore.set("admin-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function verifySession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey);
    if (typeof payload.email === "string" && typeof payload.role === "string") {
      return {
        email: payload.email,
        role: payload.role as SessionPayload["role"],
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-session");
}
