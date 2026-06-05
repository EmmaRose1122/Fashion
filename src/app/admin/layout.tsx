import Link from "next/link";
import { headers } from "next/headers";
import { SITE_NAME } from "@/lib/constants";
import { logout } from "@/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-background text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
        <div className="p-8 space-y-12">
          {/* Logo */}
          <div className="space-y-1 text-left">
            <Link href="/" target="_blank" className="font-heading text-xl tracking-widest text-text-primary hover:opacity-85">
              {SITE_NAME}
            </Link>
            <span className="block text-[9px] uppercase tracking-widest text-accent font-bold">Admin Console</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2 text-left">
            <Link
              href="/admin"
              className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-medium py-3 border-b border-border-light hover:border-accent/30 transition-all"
            >
              Console Overview
            </Link>
            <Link
              href="/admin/articles"
              className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-medium py-3 border-b border-border-light hover:border-accent/30 transition-all"
            >
              Manage Articles
            </Link>
            <Link
              href="/admin/jobs"
              className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-medium py-3 border-b border-border-light hover:border-accent/30 transition-all"
            >
              Manage Jobs
            </Link>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-8 border-t border-border-light text-left">
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 font-bold border border-red-200 hover:border-red-400 py-3 px-4 rounded-sm transition-all"
            >
              Exit Console
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-64 min-h-screen flex flex-col">
        <div className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full text-left">
          {children}
        </div>
      </main>
    </div>
  );
}
