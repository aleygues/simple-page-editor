import { createContext, useContext, useEffect, useState } from "react";
import { useMe } from "./me.hook";
import toast from "react-hot-toast";

const SocketContext = createContext<{
  send: (channel: string, message: any) => void;
} | null>(null);

export function SocketProvider(props: { children: React.ReactNode }) {
  const { me } = useMe();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (socket) {
      socket.addEventListener("close", () => {
        /* toast.error("Connection lost, reload this page", {
          duration: Infinity,
        }); */
        setSocket(null);
      });
      socket.addEventListener("open", () => {
        console.log("Connected to server");
      });
      socket.addEventListener("message", (ev) => {
        console.log("Got new message =>", ev.data);
      });
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  useEffect(() => {
    if (me) {
      const socket = new WebSocket(
        `${location.protocol === "https:" ? "wss" : "ws"}://${location.origin}`,
      );
      setSocket(socket);
    }
  }, [me]);

  async function send(channel: string, data: any) {
    if (socket) {
      socket.send(
        JSON.stringify({
          channel,
          data,
        }),
      );
    }
  }

  return (
    <SocketContext.Provider
      value={{
        send,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
}
