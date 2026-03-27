"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/login?error=Email and password are required");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Invalid credentials" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid credentials" };
    }

    // Create the session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const session = await encrypt({ 
        userId: user.id, 
        email: user.email,
        name: user.name,
        role: user.role,
        expires 
    });

    // Save the session in a cookie
    (await cookies()).set("session", session, { 
        expires, 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

  } catch (error: any) {
    console.error("Login error:", error);
    return { error: error?.message || "An unexpected error occurred" };
  }

  redirect("/");
}

export async function logoutAction() {
  (await cookies()).set("session", "", { expires: new Date(0), path: "/" });
  redirect("/login");
}
