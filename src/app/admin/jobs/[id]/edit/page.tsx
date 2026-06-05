import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JobForm } from "@/components/admin/JobForm";

export const revalidate = 0;

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const resolvedParams = await params;
  const job = (
    await supabase
      .from("Job")
      .select("*")
      .eq("id", resolvedParams.id)
      .maybeSingle()
  ).data;

  if (!job) notFound();

  return (
    <div className="space-y-8 text-left max-w-3xl">
      {/* Header */}
      <div className="border-b border-border-light pb-6 space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Console</span>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Edit Job Listing</h1>
        <p className="text-xs text-text-secondary">Modify job details, location, or status.</p>
      </div>

      <JobForm job={job} />
    </div>
  );
}
