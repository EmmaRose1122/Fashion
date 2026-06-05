import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    return `${basePath}?page=${page}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center space-x-2 pt-12 border-t border-border-light">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent px-4 py-2 border border-border rounded-sm hover:border-accent/30 transition-colors"
        >
          Previous
        </Link>
      ) : (
        <span className="text-xs uppercase tracking-widest text-text-secondary/40 px-4 py-2 border border-border-light rounded-sm cursor-not-allowed">
          Previous
        </span>
      )}

      {/* Page numbers */}
      <div className="hidden sm:flex items-center space-x-1">
        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return isCurrent ? (
            <span
              key={page}
              className="w-10 h-10 flex items-center justify-center text-xs bg-accent text-white rounded-sm font-bold"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className="w-10 h-10 flex items-center justify-center text-xs text-text-secondary hover:text-accent border border-border hover:border-accent/30 rounded-sm transition-colors"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent px-4 py-2 border border-border rounded-sm hover:border-accent/30 transition-colors"
        >
          Next
        </Link>
      ) : (
        <span className="text-xs uppercase tracking-widest text-text-secondary/40 px-4 py-2 border border-border-light rounded-sm cursor-not-allowed">
          Next
        </span>
      )}
    </nav>
  );
}
