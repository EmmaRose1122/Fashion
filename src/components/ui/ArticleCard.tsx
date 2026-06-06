import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    thumbnail: string | null;
    createdAt: Date | string;
    readTime: number | null;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { title, slug, category, excerpt, thumbnail, createdAt, readTime } = article;
  const href = `/${category}/${slug}`;

  return (
    <article className="group flex flex-col space-y-4 text-left">
      <Link href={href} className="block relative aspect-[16/10] overflow-hidden bg-border-light rounded-sm">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-border-light text-text-secondary text-xs uppercase tracking-widest">
            {category}
          </div>
        )}
        <div
          className="absolute inset-0 bg-text-primary/0 group-hover:bg-text-primary/5 transition-colors duration-500"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
          aria-hidden="true"
        />
      </Link>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-accent font-bold">
          <span className="capitalize">{category.replace("-", " ")}</span>
          <span className="text-border">•</span>
          <span className="text-text-secondary font-medium">{formatDate(createdAt)}</span>
          {readTime && (
            <>
              <span className="text-border">•</span>
              <span className="text-text-secondary font-medium">{readTime} min</span>
            </>
          )}
        </div>

        <Link href={href} className="block group-hover:text-accent transition-colors duration-300">
          <h3 className="font-heading text-lg md:text-xl font-bold leading-snug">
            {title}
          </h3>
        </Link>

        {excerpt && (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
