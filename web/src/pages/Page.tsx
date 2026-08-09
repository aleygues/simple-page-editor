import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { PageTopbar } from "../components/PageTopbar";
import type { Page } from "../interfaces";
import { CenteredContent } from "../components/CenteredContent";
import { MDXContent } from "../components/MDXContent";

export function PagePage() {
  const { pageSlug } = useParams();
  const [page, setPage] = useState<undefined | null | Page>();

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
      document.title = page.title;
    }
  }, [page]);

  if (page === undefined) {
    return <p>Loading</p>;
  }

  return (
    <>
      <PageTopbar page={page} />
      {page ? (
        <MDXContent content={page.currentVersion.content} />
      ) : (
        <CenteredContent>
          <p>No content</p>
        </CenteredContent>
      )}
    </>
  );
}
