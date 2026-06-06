import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { JobCard } from "@/components/ui/JobCard";
import { Pagination } from "@/components/ui/Pagination";
import { JOBS_PER_PAGE, JOB_TYPES } from "@/lib/constants";

export const revalidate = 0;

interface JobsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Opportunities Portal — Curated Career Board",
    description: "Browse curated vacancies in the fashion, beauty, and lifestyle industries.",
    alternates: {
      canonical: "/jobs",
    },
  };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const searchQuery = resolvedParams.q || "";
  const selectedType = resolvedParams.type || "";

  // Supabase query filters
  let countQuery = supabase
    .from("Job")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  let jobsQuery = supabase
    .from("Job")
    .select("*")
    .eq("active", true);

  if (selectedType) {
    countQuery = countQuery.eq("type", selectedType);
    jobsQuery = jobsQuery.eq("type", selectedType);
  }

  if (searchQuery) {
    const filterStr = `title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`;
    countQuery = countQuery.or(filterStr);
    jobsQuery = jobsQuery.or(filterStr);
  }

  const totalJobs = (await countQuery).count || 0;
  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

  // Featured jobs (for hero section)
  const featuredJobs = (
    await supabase
      .from("Job")
      .select("*")
      .eq("active", true)
      .eq("featured", true)
      .order("createdAt", { ascending: false })
      .limit(3)
  ).data || [];

  // Recent jobs (stats — last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const newJobsCount = (
    await supabase
      .from("Job")
      .select("*", { count: "exact", head: true })
      .eq("active", true)
      .gte("createdAt", sevenDaysAgo)
  ).count || 0;

  // Top companies count
  const distinctCompanies = (
    await supabase
      .from("Job")
      .select("company")
      .eq("active", true)
  ).data || [];
  const uniqueCompanies = new Set(distinctCompanies.map((j) => j.company)).size;

  const from = (currentPage - 1) * JOBS_PER_PAGE;
  const to = from + JOBS_PER_PAGE - 1;

  const jobs = (
    await jobsQuery
      .order("createdAt", { ascending: false })
      .range(from, to)
  ).data || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-surface border border-border rounded-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
        <div className="relative px-6 md:px-12 py-16 md:py-24 space-y-8 text-left">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-accent font-bold">
            <span>Opportunities</span>
            <span className="text-border">•</span>
            <span className="text-text-secondary font-medium">Curated Career Board</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-3xl">
            Find your next role with the world's most loved brands.
          </h1>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
            Discover handpicked career opportunities across fashion, beauty, design, and lifestyle.
            Browse vacancies from leading ateliers, indie studios, and global houses.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 max-w-2xl">
            <div className="space-y-1">
              <p className="font-heading text-3xl md:text-4xl font-bold text-text-primary">{totalJobs}</p>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
                Live Roles
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-heading text-3xl md:text-4xl font-bold text-text-primary">{uniqueCompanies}</p>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
                Brands Hiring
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-heading text-3xl md:text-4xl font-bold text-accent">{newJobsCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
                New This Week
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs (only if not filtering) */}
      {!searchQuery && !selectedType && featuredJobs.length > 0 && (
        <section className="space-y-8 text-left">
          <div className="flex items-end justify-between border-b border-border-light pb-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                ⭐ Editor's Picks
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">Featured Opportunities</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group relative bg-surface border border-border hover:border-accent transition-all rounded-sm p-6 md:p-8 space-y-4 overflow-hidden"
              >
                <span className="absolute top-4 right-4 text-[9px] uppercase tracking-widest bg-accent text-white px-2 py-1 rounded-sm font-bold">
                  Featured
                </span>
                <div className="space-y-2 pr-16">
                  <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                    {job.company}
                  </span>
                  <h3 className="font-heading text-xl md:text-2xl font-bold leading-tight group-hover:text-accent transition-colors">
                    {job.title}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary">
                  {job.location && (
                    <div className="flex items-center space-x-1.5">
                      <span>📍</span>
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.type && (
                    <div className="flex items-center space-x-1.5">
                      <span>💼</span>
                      <span>{job.type}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-center space-x-1.5">
                      <span>💰</span>
                      <span>{job.salary}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Filter / Search Form */}
      <section className="space-y-6 text-left">
        <div className="flex items-end justify-between border-b border-border-light pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
              Browse Listings
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">
              {searchQuery || selectedType ? "Filtered Results" : "All Opportunities"}
            </h2>
          </div>
        </div>

        <form action="/jobs" method="GET" className="bg-surface border border-border p-6 md:p-8 rounded-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Keyword Search */}
            <div className="md:col-span-2 text-left">
              <label htmlFor="q" className="block text-[10px] uppercase tracking-wider text-text-secondary font-semibold mb-2">
                Keywords
              </label>
              <input
                type="text"
                name="q"
                id="q"
                defaultValue={searchQuery}
                placeholder="Search by role, company, or keywords..."
                className="w-full text-sm border border-border bg-background px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary placeholder:text-text-secondary/40"
              />
            </div>

            {/* Job Type Dropdown */}
            <div className="text-left">
              <label htmlFor="type" className="block text-[10px] uppercase tracking-wider text-text-secondary font-semibold mb-2">
                Job Type
              </label>
              <select
                name="type"
                id="type"
                defaultValue={selectedType}
                className="w-full text-sm border border-border bg-background px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
              >
                <option value="">All Employment Types</option>
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            {(searchQuery || selectedType) && (
              <Link
                href="/jobs"
                className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-medium py-3 px-6 transition-colors border border-transparent rounded-sm flex items-center"
              >
                Reset Filters
              </Link>
            )}
            <button
              type="submit"
              className="text-xs uppercase tracking-widest bg-text-primary hover:bg-accent text-white px-8 py-3 rounded-sm font-semibold transition-colors"
            >
              Find Jobs
            </button>
          </div>
        </form>
      </section>

      {/* Listings */}
      <section>
        {jobs.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-4 text-left">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/jobs"
            />
          </div>
        ) : (
          <div className="py-24 border border-dashed border-border text-center text-text-secondary text-sm rounded-sm">
            <p className="text-base mb-2">No career opportunities matched your search criteria.</p>
            <p className="text-xs text-text-secondary/60">Try resetting the filters or refining your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
