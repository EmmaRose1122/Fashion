interface TagBadgeProps {
  tag: string;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span className="inline-block text-[10px] uppercase tracking-widest text-text-secondary bg-border-light border border-border px-2.5 py-0.5 rounded-sm font-medium">
      {tag}
    </span>
  );
}
