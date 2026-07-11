import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in your environment variables");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const SESSION_COOKIE = "rr_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
}

export async function signSession(payload: SessionPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as SessionPayload;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifySession(token);
  } catch (err) {
    console.error("verifySession failed:", err);
    return null;
  }
}

