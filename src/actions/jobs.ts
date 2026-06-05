"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type JobActionState = {
  error?: string;
  success?: boolean;
};

export async function createJob(
  prevState: JobActionState | undefined,
  formData: FormData
): Promise<JobActionState> {
  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  const salary = formData.get("salary") as string;
  const description = formData.get("description") as string;
  const applyLink = formData.get("applyLink") as string;
  const tagsInput = formData.get("tags") as string;
  const active = formData.get("active") === "on";
  const featured = formData.get("featured") === "on";

  if (!title || !company || !description || !applyLink) {
    return { error: "Title, Company, Description, and Apply Link are required." };
  }

  const tagsArray = tagsInput
    ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const tags = JSON.stringify(tagsArray);

  try {
    const { error } = await supabase.from("Job").insert({
      title,
      company,
      location: location || null,
      type: type || null,
      salary: salary || null,
      description,
      applyLink,
      tags,
      active,
      featured,
    });
    if (error) throw error;
  } catch (err) {
    console.error("Failed to create job:", err);
    return { error: "Database error. Failed to create job." };
  }

  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

export async function updateJob(
  id: string,
  prevState: JobActionState | undefined,
  formData: FormData
): Promise<JobActionState> {
  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  const salary = formData.get("salary") as string;
  const description = formData.get("description") as string;
  const applyLink = formData.get("applyLink") as string;
  const tagsInput = formData.get("tags") as string;
  const active = formData.get("active") === "on";
  const featured = formData.get("featured") === "on";

  if (!title || !company || !description || !applyLink) {
    return { error: "Title, Company, Description, and Apply Link are required." };
  }

  const tagsArray = tagsInput
    ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const tags = JSON.stringify(tagsArray);

  try {
    const { error } = await supabase
      .from("Job")
      .update({
        title,
        company,
        location: location || null,
        type: type || null,
        salary: salary || null,
        description,
        applyLink,
        tags,
        active,
        featured,
      })
      .eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.error("Failed to update job:", err);
    return { error: "Database error. Failed to update job." };
  }

  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

export async function deleteJob(id: string) {
  try {
    const { error } = await supabase.from("Job").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");
  } catch (err) {
    console.error("Failed to delete job:", err);
    throw new Error("Failed to delete job.");
  }
}
