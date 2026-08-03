import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../interfaces";
import axios from "axios";
import { useNavigate } from "react-router";

const MeContext = createContext<{
  me: User | null | undefined;
  signout: () => void;
  refetch: () => Promise<void>;
} | null>(null);

export function MeProvider(props: React.PropsWithChildren<unknown>) {
  const [me, setMe] = useState<User | null | undefined>(undefined);
  const navigate = useNavigate();

  async function refetch() {
    const { data } = await axios.get("/api/users/me");
    setMe(data);
  }

  async function signout() {
    await axios.delete("/api/users/tokens");
    navigate("/", { replace: true });
    refetch();
  }

  useEffect(() => {
    refetch();
  }, []);

  return (
    <MeContext.Provider value={{ refetch, signout, me }}>
      {props.children}
    </MeContext.Provider>
  );
}

export function useMe() {
  const context = useContext(MeContext);

  if (!context) {
    throw new Error("useMe must be used within a MeProvider");
  }

  return context;
}
