import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { deleteJob } from "@/actions/jobs";

export const revalidate = 0;

export default async function AdminJobsListPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light pb-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Console</span>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Manage Jobs</h1>
        </div>
        <Link
          href="/admin/jobs/new"
          className="text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-sm font-semibold transition-colors self-start"
        >
          New Job Listing
        </Link>
      </div>

      {/* Table */}
      {jobs.length > 0 ? (
        <div className="bg-surface border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-background/40 transition-colors">
                    <td className="px-6 py-4 font-medium max-w-xs truncate">{job.title}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{job.company}</td>
                    <td className="px-6 py-4 text-xs">{job.location || "Remote"}</td>
                    <td className="px-6 py-4 text-xs">{job.type || "Full-time"}</td>
                    <td className="px-6 py-4">
                      {job.active ? (
                        <span className="inline-block text-[9px] uppercase tracking-wider bg-green-50 text-green-700 border border-green-150 px-2 py-0.5 rounded-sm font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block text-[9px] uppercase tracking-wider bg-red-50 text-red-700 border border-red-150 px-2 py-0.5 rounded-sm font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-4">
                        <Link
                          href={`/admin/jobs/${job.id}/edit`}
                          className="text-xs text-text-secondary hover:text-accent font-medium"
                        >
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteJob(job.id);
                          }}
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="text-xs text-red-500 hover:text-red-700 font-bold"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-24 border border-dashed border-border text-center text-text-secondary text-sm rounded-sm">
          No job opportunities posted yet. Click "New Job Listing" to create your first vacancy.
        </div>
      )}
    </div>
  );
}
