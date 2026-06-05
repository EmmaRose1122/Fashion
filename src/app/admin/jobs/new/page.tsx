"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createJob } from "@/actions/jobs";
import { JOB_TYPES } from "@/lib/constants";

export default function NewJobPage() {
  const [state, action, isPending] = useActionState(createJob, undefined);

  return (
    <div className="space-y-8 text-left max-w-3xl">
      {/* Header */}
      <div className="border-b border-border-light pb-6 space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Console</span>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Add New Job Listing</h1>
        <p className="text-xs text-text-secondary">Post a new career opportunity on the jobs board.</p>
      </div>

      <form action={action} className="space-y-6">
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
              defaultChecked
              className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
            />
            <span className="text-xs uppercase tracking-wider text-text-secondary font-bold select-none">
              Active Listing Immediately
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
            />
            <span className="text-xs uppercase tracking-wider text-text-secondary font-bold select-none">
              Feature on Homepage
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
            {isPending ? "Creating Listing..." : "Create Listing"}
          </button>
          <Link
            href="/admin/jobs"
            className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-medium py-4 px-2 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
