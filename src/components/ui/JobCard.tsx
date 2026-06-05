import Link from "next/link";
import { TagBadge } from "./TagBadge";
import { parseTags } from "@/lib/utils";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string | null;
    type: string | null;
    salary: string | null;
    description: string;
    applyLink: string;
    tags: string | null;
    createdAt: Date | string;
  };
}

export function JobCard({ job }: JobCardProps) {
  const { id, title, company, location, type, salary, tags, applyLink } = job;
  const parsedTags = parseTags(tags);

  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-sm hover:border-accent/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-4 flex-1">
        {/* Header */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
            {company}
          </span>
          <Link href={`/jobs/${id}`} className="block hover:text-accent transition-colors">
            <h3 className="font-heading text-xl font-bold leading-tight">
              {title}
            </h3>
          </Link>
        </div>

        {/* Meta details */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary">
          {location && (
            <div className="flex items-center space-x-1">
              <span>📍</span>
              <span>{location}</span>
            </div>
          )}
          {type && (
            <div className="flex items-center space-x-1">
              <span>💼</span>
              <span>{type}</span>
            </div>
          )}
          {salary && (
            <div className="flex items-center space-x-1">
              <span>💰</span>
              <span>{salary}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {parsedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {parsedTags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="flex flex-row md:flex-col items-center md:items-end gap-3 justify-between md:justify-center border-t border-border-light md:border-0 pt-4 md:pt-0">
        <Link
          href={`/jobs/${id}`}
          className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-medium py-2 px-1 transition-colors"
        >
          View Details
        </Link>
        <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-sm text-center font-medium transition-colors"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}
