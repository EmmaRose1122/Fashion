"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateJob } from "@/actions/jobs";
import { JOB_TYPES } from "@/lib/constants";
import { parseTags } from "@/lib/utils";

interface JobFormProps {
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
    active: boolean;
    featured: boolean;
  };
}

export function JobForm({ job }: JobFormProps) {
  const updateJobWithId = updateJob.bind(null, job.id);
  const [state, action, isPending] = useActionState(updateJobWithId, undefined);

  const parsedTags = parseTags(job.tags).join(", ");

  return (
    <form action={action} className="space-y-6 text-left">
      {state?.error && (
        <div className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 p-4 rounded-sm">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={job.title}
            placeholder="e.g. Senior Fashion Stylist"
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Company */}
        <div className="space-y-2">
          <label htmlFor="company" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Company *
          </label>
          <input
            type="text"
            name="company"
            id="company"
            required
            defaultValue={job.company}
            placeholder="e.g. Chanel"
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label htmlFor="location" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            defaultValue={job.location || ""}
            placeholder="e.g. Paris, France (or Remote)"
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <label htmlFor="type" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Job Type *
          </label>
          <select
            name="type"
            id="type"
            required
            defaultValue={job.type || "Full-time"}
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <label htmlFor="salary" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Salary / Compensation Range
          </label>
          <input
            type="text"
            name="salary"
            id="salary"
            defaultValue={job.salary || ""}
            placeholder="e.g. $80,000 - $100,000 / year"
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Apply Link */}
        <div className="space-y-2">
          <label htmlFor="applyLink" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Apply Link URL *
          </label>
          <input
            type="url"
            name="applyLink"
            id="applyLink"
            required
            defaultValue={job.applyLink}
            placeholder="https://company-careers-page.com/job/..."
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="tags" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            defaultValue={parsedTags}
            placeholder="design, styling, luxury, retail"
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Job Description (HTML Format Supported) *
          </label>
          <textarea
            name="description"
            id="description"
            required
            rows={12}
            defaultValue={job.description}
            placeholder="Describe the job description, role, requirements, and benefits..."
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary font-mono resize-y"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-8 py-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            id="active"
            defaultChecked={job.active}
            className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
          />
          <span className="text-xs uppercase tracking-wider text-text-secondary font-bold select-none">
            Active Listing
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            defaultChecked={job.featured}
            className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
          />
          <span className="text-xs uppercase tracking-wider text-text-secondary font-bold select-none">
            Featured on Homepage
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-6 border-t border-border-light">
        <button
          type="submit"
          disabled={isPending}
          className="text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover disabled:bg-text-secondary/40 text-white px-8 py-4 rounded-sm font-semibold transition-colors"
        >
          {isPending ? "Saving Changes..." : "Save Changes"}
        </button>
        <Link
          href="/admin/jobs"
          className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-medium py-4 px-2 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
