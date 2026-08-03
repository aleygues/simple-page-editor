import { Route, Routes } from "react-router";
import { PagePage } from "./pages/Page";
import { Toaster } from "react-hot-toast";
import { SigninPage } from "./pages/Signin";
import { useMe } from "./hooks/me.hook";
import { EditorPage } from "./pages/Editor";

function App() {
  const { me } = useMe();

  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        {me === null && <Route path="/signin" element={<SigninPage />} />}
        {me && <Route path="/editor/:id" element={<EditorPage />} />}
        <Route path="/:pageSlug" element={<PagePage />} />
        <Route path="/" element={<PagePage />} />
      </Routes>
    </>
  );
}

export default App;
