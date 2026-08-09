import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { jsxLanguage } from "@codemirror/lang-javascript";
import { useEffect, useRef, useState } from "react";
import { androidstudio } from "@uiw/codemirror-theme-androidstudio";
import { EditorTopbar } from "../components/EditorTopbar";
import axios from "axios";
import type { Component, Page, Version } from "../interfaces";
import { useParams } from "react-router";
import { CenteredContent } from "../components/CenteredContent";
import { toast } from "react-hot-toast";
import { CompletionContext } from "@codemirror/autocomplete";
import { Page as PageComponent } from "../components/Page";
import { customComponents } from "../components";

function myCompletions(context: CompletionContext) {
  let word = context.matchBefore(/[\w<>\s-]*/);

  // Check if we're in a JSX tag context (after <)
  const inTag = context.matchBefore(/<[\w-]*$/);

  if (!context.explicit && !inTag) {
    return null;
  }

  const from = inTag ? inTag.from : (word?.from ?? context.pos);

  // Get all custom component names
  const componentNames = Object.keys(customComponents);

  // Markdown completions
  const markdownOptions = [
    { label: "# Heading 1", type: "keyword", apply: "# ", detail: "markdown" },
    {
      label: "## Heading 2",
      type: "keyword",
      apply: "## ",
      detail: "markdown",
    },
    {
      label: "### Heading 3",
      type: "keyword",
      apply: "### ",
      detail: "markdown",
    },
    {
      label: "**bold**",
      type: "keyword",
      apply: "**bold**",
      detail: "markdown",
    },
    {
      label: "*italic*",
      type: "keyword",
      apply: "*italic*",
      detail: "markdown",
    },
    { label: "`code`", type: "keyword", apply: "`code`", detail: "markdown" },
    {
      label: "[link](url)",
      type: "keyword",
      apply: "[link](url)",
      detail: "markdown",
    },
    { label: "---", type: "keyword", apply: "---", detail: "markdown" },
  ];

  // Component completions
  const componentOptions = componentNames.map((name) => {
    const isVoid = name === "Void" || name === "Image" || name === "ButtonLink";

    if (isVoid) {
      return {
        label: name,
        type: "keyword",
        apply: `<${name} />`,
        detail: "component",
      };
    }

    return {
      label: name,
      type: "keyword",
      apply: `<${name}>\n\n</${name}>`,
      detail: "component",
    };
  });

  // JSX attribute completions (for Image, Section, Row, etc.)
  const attributeOptions = [
    { label: "src", type: "property", apply: 'src=""', detail: "attribute" },
    { label: "alt", type: "property", apply: 'alt=""', detail: "attribute" },
    {
      label: "width",
      type: "property",
      apply: 'width=""',
      detail: "attribute",
    },
    {
      label: "height",
      type: "property",
      apply: 'height=""',
      detail: "attribute",
    },
    {
      label: "fit",
      type: "property",
      apply: 'fit="contain"',
      detail: "attribute",
    },
    {
      label: "borderRadius",
      type: "property",
      apply: "borderRadius",
      detail: "attribute",
    },
    { label: "center", type: "property", apply: "center", detail: "attribute" },
  ];

  // Check if we're inside a tag to show attributes
  const inTagWithSpace = context.matchBefore(/<[\w-]+\s+[\w-]*$/);

  if (inTagWithSpace) {
    return {
      from: inTagWithSpace.from,
      options: attributeOptions,
    };
  }

  // If we're at the start of a tag, show components
  if (inTag) {
    return {
      from: from,
      options: componentOptions,
    };
  }

  // Otherwise show everything
  return {
    from: from,
    options: [...markdownOptions, ...componentOptions],
  };
}

export function EditorPage() {
  const { pageId, componentId } = useParams();
  const [page, setPage] = useState<undefined | Page>();
  const [component, setComponent] = useState<undefined | Component>();
  const [content, setContent] = useState<string>();
  const [version, setVersion] = useState<Version | null>(null);
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  async function fetchItem() {
    if (pageId) {
      const { data } = await axios.get(`/api/pages/${pageId}`);
      setPage(data);
      setContent(data.currentVersion.content);
    } else if (componentId) {
      const { data } = await axios.get(`/api/components/${componentId}`);
      setComponent(data);
      setContent(data.currentVersion.content);
    }
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
        [pageId ? "page" : "component"]: { id: pageId || componentId },
        content,
      });
      setVersion(data);
      toast.success("Version created successfully");
    }
  }

  useEffect(() => {
    fetchItem();
  }, [pageId, componentId]);

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

  async function onComponentSelect(component: { tag: string }) {
    if (editorRef.current?.view) {
      editorRef.current?.view.dispatch({
        changes: {
          from: editorRef.current?.view.state.selection.main.from,
          to: editorRef.current?.view.state.selection.main.to,
          insert: `<${component.tag}>\n\n</${component.tag}>`,
        },
      });
    }
  }

  if (page === undefined && component === undefined) {
    return (
      <CenteredContent>
        <p>Loading...</p>
      </CenteredContent>
    );
  }

  return (
    <>
      <PageComponent>
        <EditorTopbar
          page={page}
          component={component}
          onSave={onSave}
          onMediaSelect={onMediaSelect}
          onComponentSelect={onComponentSelect}
        />
        <CodeMirror
          value={content}
          height="100%"
          style={{ height: "100%", width: "100%" }}
          extensions={[
            markdown({}),
            jsxLanguage,
            markdownLanguage.data.of({ autocomplete: myCompletions }),
          ]}
          theme={androidstudio}
          onChange={setContent}
          ref={editorRef}
        />
      </PageComponent>
    </>
  );
}
