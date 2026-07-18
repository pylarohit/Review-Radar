import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, SESSION_COOKIE } from "@/lib/auth";
import { encryptPassword } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    let dbPassword = "";
    let encryptionKeyUsed = "";
    try {
      const { encrypted, keyUsed } = encryptPassword(password);
      dbPassword = encrypted;
      encryptionKeyUsed = keyUsed;
    } catch (err) {
      console.error("Password encryption failed during signup:", err);
      // If encryption fails, save the password like it was (hashed with bcrypt)
      dbPassword = await bcrypt.hash(password, 10);
      encryptionKeyUsed = process.env.PASSWORD_ENCRYPTION_KEY || "";
    }

    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: dbPassword },
    });

    const token = await signSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.json(
      {
        message: "Account created",
        user: { id: user.id, name: user.name, email: user.email },
        encryptionKey: encryptionKeyUsed,
      },
      { status: 201 }
    );

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
