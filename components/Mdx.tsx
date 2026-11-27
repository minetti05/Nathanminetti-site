import { Children, isValidElement, cloneElement, type ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Text } from "./Text";

/** Runs plain text inside MDX through <Text>, so [bracketed] gaps show as placeholders. */
function withPlaceholders(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") return <Text>{child}</Text>;
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
      return cloneElement(child, undefined, withPlaceholders(child.props.children));
    }
    return child;
  });
}

const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href);

const components = {
  p: ({ children }: { children?: ReactNode }) => <p>{withPlaceholders(children)}</p>,
  li: ({ children }: { children?: ReactNode }) => <li>{withPlaceholders(children)}</li>,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      className="link"
      {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  ),
};

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
