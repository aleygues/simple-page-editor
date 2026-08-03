import { evaluateSync } from "@mdx-js/mdx";
import type { MDXComponents, MDXModule } from "mdx/types.js";
import * as runtime from "react/jsx-runtime";
import { customComponents } from "../components";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { PageTopbar } from "../components/PageTopbar";
import type { Page } from "../interfaces";
import { CenteredContent } from "../components/CenteredContent";

const components: MDXComponents = {
  em(properties) {
    return <i {...properties} />;
  },
  strong(properties) {
    return <strong {...properties} />;
  },
  ...customComponents,
};

export function PagePage() {
  const { pageSlug } = useParams();
  const [page, setPage] = useState<undefined | null | Page>();
  const [Content, setContent] = useState<undefined | MDXModule>();

  async function fetchPage() {
    try {
      const computedPageSlug = pageSlug || "home";
      const { data } = await axios.get(`/api/pages/${computedPageSlug}`);
      setPage(data);
    } catch {
      setPage(null);
    }
  }

  useEffect(() => {
    fetchPage();
  }, [pageSlug]);

  useEffect(() => {
    if (page) {
      setContent(evaluateSync(page.currentVersion.content, runtime));
    }
  }, [page]);

  if (page === undefined) {
    return <p>Loading</p>;
  }

  return (
    <>
      <PageTopbar page={page} />
      {Content ? (
        <Content.default components={components} />
      ) : (
        <CenteredContent>
          <p>No content</p>
        </CenteredContent>
      )}
    </>
  );
}
