import { Route, Routes } from "react-router";
import { PagePage } from "./pages/Page";
import { Toaster } from "react-hot-toast";
import { SigninPage } from "./pages/Signin";
import { PasswordResetPage } from "./pages/PasswordReset";
import { useMe } from "./hooks/me.hook";
import { EditorPage } from "./pages/Editor";

function App() {
  const { me } = useMe();

  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/signin" element={<SigninPage />} />
        {me && <Route path="/editor/pages/:pageId" element={<EditorPage />} />}
        {me && (
          <Route
            path="/editor/components/:componentId"
            element={<EditorPage />}
          />
        )}
        <Route path="/:pageSlug" element={<PagePage />} />
        <Route path="/" element={<PagePage />} />
      </Routes>
    </>
  );
}

export default App;
