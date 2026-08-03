import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useEffect, useRef, useState } from "react";
import { androidstudio } from "@uiw/codemirror-theme-androidstudio";
import { EditorTopbar } from "../components/EditorTopbar";
import axios from "axios";
import type { Page, Version } from "../interfaces";
import { useParams } from "react-router";
import { CenteredContent } from "../components/CenteredContent";
import { toast } from "react-hot-toast";

export function EditorPage() {
  const { id } = useParams();
  const [page, setPage] = useState<undefined | Page>();
  const [content, setContent] = useState<string>();
  const [version, setVersion] = useState<Version | null>(null);
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  async function fetchPage() {
    const { data } = await axios.get(`/api/pages/${id}`);
    setPage(data);
    setContent(data.currentVersion.content);
  }

  async function onSave() {
    if (version) {
      const { data } = await axios.patch<Version>(
        `/api/versions/${version.id}`,
        {
          page: { id: page?.id },
          content,
        },
      );
      setVersion(data);
      toast.success("Version updated successfully");
    } else {
      const { data } = await axios.post<Version>(`/api/versions`, {
        page: { id: page?.id },
        content,
      });
      setVersion(data);
      toast.success("Version created successfully");
    }
  }

  useEffect(() => {
    fetchPage();
  }, [id]);

  async function onMediaSelect(media: { id: number }) {
    if (editorRef.current?.view) {
      editorRef.current?.view.dispatch({
        changes: {
          from: editorRef.current?.view.state.selection.main.from,
          to: editorRef.current?.view.state.selection.main.to,
          insert: `<Image src="/api/media/${media.id}" width="300" fit="contain" borderRadius />`,
        },
      });
    }
  }

  if (page === undefined) {
    return (
      <CenteredContent>
        <p>Loading...</p>
      </CenteredContent>
    );
  }

  return (
    <>
      <EditorTopbar page={page} onSave={onSave} onMediaSelect={onMediaSelect} />
      <CodeMirror
        value={content}
        height="100%"
        style={{ height: "100%" }}
        extensions={[markdown({})]}
        theme={androidstudio}
        onChange={setContent}
        ref={editorRef}
      />
      ;
    </>
  );
}
