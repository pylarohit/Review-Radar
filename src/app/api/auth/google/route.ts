import { NextResponse } from "next/server";
import { jwtVerify, importX509, JWTHeaderParameters } from "jose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signSession, SESSION_COOKIE } from "@/lib/auth";

let cachedPublicKeys: Record<string, string> | null = null;
let cacheExpiry: number = 0;

async function getFirebasePublicKeys() {
  const now = Date.now();
  if (cachedPublicKeys && now < cacheExpiry) {
    return cachedPublicKeys;
  }
  const res = await fetch(
    "https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch Firebase public keys");
  }

  const cacheControl = res.headers.get("cache-control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) * 1000 : 3600 * 1000;

  cachedPublicKeys = await res.json();
  cacheExpiry = now + maxAge;
  return cachedPublicKeys!;
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { message: "ID Token is required" },
        { status: 400 }
      );
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      return NextResponse.json(
        { message: "Firebase Project ID is not configured on the server" },
        { status: 500 }
      );
    }

    // Verify the Google Firebase ID Token (JWT) using Google public certificates
    let payload;
    try {
      const publicKeys = await getFirebasePublicKeys();
      const result = await jwtVerify(
        idToken,
        async (header: JWTHeaderParameters) => {
          const kid = header.kid;
          if (!kid || !publicKeys[kid]) {
            throw new Error(`Public key not found for key ID (kid) "${kid}"`);
          }
          return await importX509(publicKeys[kid], "RS256");
        },
        {
          issuer: `https://securetoken.google.com/${projectId}`,
          audience: projectId,
          algorithms: ["RS256"],
        }
      );
      payload = result.payload;
    } catch (verifyError: any) {
      console.error("Token verification failed:", verifyError);
      return NextResponse.json(
        { message: "Invalid ID Token", details: verifyError.message },
        { status: 401 }
      );
    }

    const email = payload.email as string;
    const name = (payload.name || "Google User") as string;

    if (!email) {
      return NextResponse.json(
        { message: "Token does not contain email claim" },
        { status: 400 }
      );
    }

    // Check if the user already exists in the database
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // If the user does not exist, register them
    if (!user) {
      // Generate a strong, random password for Google-authenticated users
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });
    }

    // Sign session token for local authentication
    const token = await signSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.json({
      message: "Success",
      user: { id: user.id, name: user.name, email: user.email },
    });

    // Set custom session cookie
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error("Google Auth backend error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
