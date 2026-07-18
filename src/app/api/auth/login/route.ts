import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, SESSION_COOKIE } from "@/lib/auth";
import { decryptPassword } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    let isValid = false;
    const isEncrypted = user.password.startsWith("enc:");

    if (isEncrypted) {
      try {
        const decrypted = decryptPassword(user.password);
        isValid = decrypted === password;
      } catch (err) {
        console.error("Password decryption failed during login:", err);
        // Fallback to bcrypt compare check in case it fails or was stored differently
        isValid = await bcrypt.compare(password, user.password);
      }
    } else {
      // Saved like it was (hashed with bcrypt)
      isValid = await bcrypt.compare(password, user.password);
    }

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.json({
      message: "Logged in",
      user: { id: user.id, name: user.name, email: user.email },
      encryptionKey: process.env.PASSWORD_ENCRYPTION_KEY || "",
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
