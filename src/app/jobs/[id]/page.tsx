import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatDate, parseTags } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { TagBadge } from "@/components/ui/TagBadge";

export const revalidate = 0;

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const job = (
    await supabase
      .from("Job")
      .select("*")
      .eq("id", resolvedParams.id)
      .maybeSingle()
  ).data;

  if (!job) return { title: "Not Found" };

  return {
    title: `${job.title} at ${job.company}`,
    description: `Career opportunity for ${job.title} at ${job.company}. Learn more and apply.`,
    alternates: {
      canonical: `${SITE_URL}/jobs/${job.id}`,
    },
    openGraph: {
      type: "website",
      title: `${job.title} at ${job.company}`,
      description: `Apply for ${job.title} at ${job.company}.`,
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const resolvedParams = await params;
  const job = (
    await supabase
      .from("Job")
      .select("*")
      .eq("id", resolvedParams.id)
      .eq("active", true)
      .maybeSingle()
  ).data;

  if (!job) notFound();

  const parsedTags = parseTags(job.tags);

  // Structured Data (JSON-LD) for Google Jobs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": new Date(job.createdAt).toISOString(),
    "validThrough": new Date(new Date(job.createdAt).getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days fallback
    "employmentType": job.type ? job.type.toUpperCase().replace("-", "_") : "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": SITE_URL
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Remote",
        "addressRegion": "",
        "addressCountry": "US"
      }
    },
    "baseSalary": job.salary ? {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "YEAR"
      }
    } : undefined
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10 text-left">
      {/* Schema.org JobPosting Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="text-xs uppercase tracking-widest text-text-secondary">
        <Link href="/jobs" className="hover:text-accent">Jobs</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary/60">Position Details</span>
      </div>

      {/* Header Info */}
      <div className="bg-surface border border-border p-8 md:p-12 rounded-sm space-y-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-accent font-bold">
              {job.company}
            </span>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {job.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm text-text-secondary font-medium">
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
            <div className="flex items-center space-x-1.5">
              <span>📅</span>
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>

          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {parsedTags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 md:pt-0 border-t border-border-light md:border-0">
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-sm font-semibold transition-colors text-center w-full md:w-auto"
          >
            Apply for this Role
          </a>
        </div>
      </div>

      {/* Job Description Content */}
      <div className="bg-surface border border-border p-8 md:p-12 rounded-sm space-y-6">
        <h2 className="font-heading text-xl md:text-2xl font-bold border-b border-border-light pb-4">
          Job Description
        </h2>
        <div 
          className="article-content leading-relaxed text-sm md:text-base text-text-secondary"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
      </div>

      {/* Footer CTA */}
      <div className="text-center pt-6">
        <Link
          href="/jobs"
          className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-bold border-b border-transparent hover:border-accent pb-1 transition-all"
        >
          ← Back to Job Board
        </Link>
      </div>
    </div>
  );
}
