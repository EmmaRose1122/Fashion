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

  // Quiet luxury layout: elegant image, thin borders, centered/minimal metadata
  return (
    <article className="group flex flex-col space-y-4 text-left">
      <Link href={href} className="block relative aspect-[16/10] overflow-hidden bg-border-light rounded-sm">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-border-light text-text-secondary text-xs uppercase tracking-widest">
            {category}
          </div>
        )}
      </Link>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-accent font-bold">
          <span>{category}</span>
          <span className="text-border">•</span>
          <span className="text-text-secondary font-medium">{formatDate(createdAt)}</span>
          {readTime && (
            <>
              <span className="text-border">•</span>
              <span className="text-text-secondary font-medium">{readTime} min read</span>
            </>
          )}
        </div>

        <Link href={href} className="group-hover:text-accent transition-colors">
          <h3 className="font-heading text-lg md:text-xl font-bold leading-snug group-hover:underline decoration-accent/30 decoration-1 underline-offset-4">
            {title}
          </h3>
        </Link>

        {excerpt && (
          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
