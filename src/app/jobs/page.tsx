import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
    title: "Job Board — Career Opportunities",
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

  // Prisma query filters
  const whereClause: any = {
    active: true,
  };

  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { company: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (selectedType) {
    whereClause.type = selectedType;
  }

  const totalJobs = await prisma.job.count({ where: whereClause });
  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

  const jobs = await prisma.job.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * JOBS_PER_PAGE,
    take: JOBS_PER_PAGE,
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4 border-b border-border-light pb-10 text-left">
        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Careers</span>
        <h1 className="text-4xl md:text-5xl font-bold font-heading">Opportunities Portal</h1>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed">
          Find your next career move with premier brands in beauty, cosmetics, design, and styling.
        </p>
      </div>

      {/* Filter / Search Form - Zero JS needed, keeps page fast and SEO-friendly */}
      <form action="/jobs" method="GET" className="bg-surface border border-border p-6 rounded-sm space-y-6">
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

        <div className="flex justify-end gap-3">
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

      {/* Listings */}
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
        <div className="py-24 border border-dashed border-border text-center text-text-secondary text-sm">
          No career opportunities matched your search criteria.
        </div>
      )}
    </div>
  );
}
