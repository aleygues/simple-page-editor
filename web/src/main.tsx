import { createRoot } from "react-dom/client";
import "./variables.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { MeProvider } from "./hooks/me.hook.tsx";
import { PagesProvider } from "./hooks/pages.hook.tsx";
import { SocketProvider } from "./hooks/socket.hook.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MeProvider>
      <PagesProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </PagesProvider>
    </MeProvider>
  </BrowserRouter>,
);
