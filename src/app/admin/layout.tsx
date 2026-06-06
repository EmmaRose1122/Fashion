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

  const navItems = [
    { href: "/admin", label: "Console Overview" },
    { href: "/admin/articles", label: "Manage Articles" },
    { href: "/admin/jobs", label: "Manage Jobs" },
    { href: "/admin/header", label: "Header & Site Code" },
  ];

  return (
    <div className="min-h-screen flex bg-background text-text-primary">
      <aside className="w-64 border-r border-border bg-surface flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
        <div className="p-8 space-y-12">
          <div className="space-y-1 text-left">
            <Link href="/" target="_blank" className="font-heading text-xl tracking-widest text-text-primary hover:opacity-85">
              {SITE_NAME}
            </Link>
            <span className="block text-[9px] uppercase tracking-widest text-accent font-bold">Admin Console</span>
          </div>

          <nav className="flex flex-col space-y-2 text-left">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-widest font-medium py-3 border-b border-border-light transition-all ${pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href))
                    ? "text-accent border-accent/40"
                    : "text-text-secondary hover:text-accent hover:border-accent/30"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

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

      <main className="flex-1 pl-64 min-h-screen flex flex-col">
        <div className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full text-left">
          {children}
        </div>
      </main>
    </div>
  );
}
