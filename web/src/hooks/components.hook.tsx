import { createContext, useContext, useEffect, useState } from "react";
import type { Component } from "../interfaces";
import axios from "axios";

const ComponentsContext = createContext<{
  components: Component[] | undefined;
  refetch: () => Promise<void>;
} | null>(null);

export function ComponentsProvider(props: React.PropsWithChildren<unknown>) {
  const [components, setComponents] = useState();

  async function refetch() {
    const { data } = await axios.get("/api/components");
    setComponents(data);
  }

  useEffect(() => {
    refetch();
  }, []);

  return (
    <ComponentsContext.Provider value={{ refetch, components }}>
      {props.children}
    </ComponentsContext.Provider>
  );
}

export function useComponents() {
  const context = useContext(ComponentsContext);

  if (!context) {
    throw new Error("useComponents must be used within a MeProvider");
  }

  return context;
}
