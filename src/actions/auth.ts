"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/auth";

export async function login(prevState: { error?: string } | undefined, formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password !== adminPassword) {
    return { error: "Invalid password credentials" };
  }

  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
