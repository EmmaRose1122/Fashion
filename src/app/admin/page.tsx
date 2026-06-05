import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  const [
    totalArticlesRes,
    publishedArticlesRes,
    totalJobsRes,
    activeJobsRes
  ] = await Promise.all([
    supabase.from("Article").select("*", { count: "exact", head: true }),
    supabase.from("Article").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("Job").select("*", { count: "exact", head: true }),
    supabase.from("Job").select("*", { count: "exact", head: true }).eq("active", true)
  ]);

  const totalArticles = totalArticlesRes.count || 0;
  const publishedArticles = publishedArticlesRes.count || 0;
  const totalJobs = totalJobsRes.count || 0;
  const activeJobs = activeJobsRes.count || 0;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2 text-left">
        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Console</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-text-secondary">Manage and monitor your site content and job listings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Articles */}
        <div className="bg-surface border border-border p-6 rounded-sm space-y-2 text-left">
          <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">Total Articles</span>
          <p className="font-heading text-4xl font-bold">{totalArticles}</p>
          <span className="text-xs text-accent">{publishedArticles} Published</span>
        </div>

        {/* Total Jobs */}
        <div className="bg-surface border border-border p-6 rounded-sm space-y-2 text-left">
          <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">Total Jobs</span>
          <p className="font-heading text-4xl font-bold">{totalJobs}</p>
          <span className="text-xs text-accent">{activeJobs} Active Listings</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6 text-left">
        <h2 className="font-heading text-2xl font-bold border-b border-border-light pb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border p-6 rounded-sm flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold">New Editorial Article</h3>
              <p className="text-xs text-text-secondary">Publish a story under Fashion or Beauty.</p>
            </div>
            <Link
              href="/admin/articles/new"
              className="text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-sm font-semibold transition-colors"
            >
              Write Article
            </Link>
          </div>

          <div className="bg-surface border border-border p-6 rounded-sm flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold">New Job Listing</h3>
              <p className="text-xs text-text-secondary">Create a vacancy opportunity on the board.</p>
            </div>
            <Link
              href="/admin/jobs/new"
              className="text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-sm font-semibold transition-colors"
            >
              Add Job
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
