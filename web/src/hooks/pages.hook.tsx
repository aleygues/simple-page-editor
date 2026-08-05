import { createContext, useContext, useEffect, useState } from "react";
import type { Page } from "../interfaces";
import axios from "axios";

const PagesContext = createContext<{
  pages: Page[] | undefined;
  refetch: () => Promise<void>;
} | null>(null);

export function PagesProvider(props: React.PropsWithChildren<unknown>) {
  const [pages, setPages] = useState();

  async function refetch() {
    const { data } = await axios.get("/api/pages");
    setPages(data);
  }

  useEffect(() => {
    refetch();
  }, []);

  return (
    <PagesContext.Provider value={{ refetch, pages }}>
      {props.children}
    </PagesContext.Provider>
  );
}

export function usePages() {
  const context = useContext(PagesContext);

  if (!context) {
    throw new Error("usePages must be used within a MeProvider");
  }

  return context;
}
