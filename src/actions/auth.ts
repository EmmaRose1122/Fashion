"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/auth";

// Strong default admin credentials.
// In production, override both via .env.local and rotate regularly.
const DEFAULT_ADMIN_EMAIL = "editor@fashionhub.studio";
const DEFAULT_ADMIN_PASSWORD = "FH-Curated-2026!Lux-Quiet";

function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase().trim();
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export async function login(
  prevState: { error?: string } | undefined,
  formData: FormData
) {
  const email = ((formData.get("email") as string) || "").toLowerCase().trim();
  const password = (formData.get("password") as string) || "";

  // Basic validation
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();

  if (email !== adminEmail || password !== adminPassword) {
    // Generic error to prevent email enumeration
    return { error: "Invalid email or password." };
  }

  await createSession({ email, role: "admin" });
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/secure-portal");
}
