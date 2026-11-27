import { Fragment } from "react";

/**
 * Renders a line of content copy. Any [bracketed] part is shown as a visible
 * placeholder, so gaps in the content are impossible to miss on the site.
 */
export function Text({ children }: { children?: string | null }) {
  if (!children) return null;
  const parts = children.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <span key={i} className={part.startsWith("[Draft") ? "ph ph-draft" : "ph"} data-placeholder>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export const isPlaceholder = (s?: string | null) => !s || /^\[[^\]]*\]$/.test(s.trim());
