import { evaluateSync } from "@mdx-js/mdx";
import type { MDXComponents, MDXModule } from "mdx/types.js";
import * as runtime from "react/jsx-runtime";
import { customComponents } from "../components";
import { useEffect, useMemo, useState } from "react";
import { useComponents } from "../hooks/components.hook";
import remarkGfm from "remark-gfm";

const staticComponents: MDXComponents = {
  em(properties) {
    return <i {...properties} />;
  },
  strong(properties) {
    return <strong {...properties} />;
  },
  ...customComponents,
};

export function MDXContent(props: { content: string }) {
  const { components } = useComponents();
  const [Content, setContent] = useState<undefined | MDXModule>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.content) {
      try {
        setContent(
          evaluateSync(props.content, {
            remarkPlugins: [remarkGfm],
            jsx: runtime.jsx,
            jsxs: runtime.jsxs,
            Fragment: runtime.Fragment,
          }),
        );
        setError(null);
      } catch (err) {
        const message =
          import.meta.env.DEV
            ? `Invalid MDX content: ${err instanceof Error ? err.message : String(err)}`
            : "Invalid MDX content";
        setError(message);
        setContent(undefined);
      }
    }
  }, [props.content]);

  const editorComponents = useMemo(
    () => ({
      ...staticComponents,
      ...(components
        ? components?.reduce(
            (components, component) => {
              components[component.tag] = () => (
                <MDXContent content={component.currentVersion.content} />
              );
              return components;
            },
            {} as { [key: string]: React.FunctionComponent },
          )
        : {}),
    }),
    [components],
  );

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!Content) {
    return null;
  } else {
    try {
      return <Content.default components={editorComponents} />;
    } catch (err) {
      const message =
        import.meta.env.DEV
          ? `Invalid MDX content: ${err instanceof Error ? err.message : String(err)}`
          : "Invalid MDX content";
      return <p style={{ color: "red" }}>{message}</p>;
    }
  }
}
