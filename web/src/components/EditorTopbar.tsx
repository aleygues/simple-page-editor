import { FiArrowLeft, FiImage, FiSave, FiSettings } from "react-icons/fi";
import { useMe } from "../hooks/me.hook";
import { Toolbar } from "./Toolbar";
import { Void } from "./Void";
import type { Media, Page } from "../interfaces";
import { Button } from "./Button";
import { PageEditorModal } from "../modals/PageEditor";
import { useState } from "react";
import { MediaModal } from "../modals/Media";
import { useNavigate } from "react-router";

export function EditorTopbar(props: {
  page: Page;
  onSave: () => void;
  onMediaSelect?: (media: Media) => void;
}) {
  const { me } = useMe();
  const navigate = useNavigate();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  return me ? (
    <>
      <PageEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        page={props.page}
      />
      <MediaModal
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onMediaSelect={(media) => {
          setIsMediaOpen(false);
          if (props.onMediaSelect) {
            props.onMediaSelect(media);
          }
        }}
      />
      <Toolbar>
        <Button
          fill="clear"
          onClick={() => navigate(`/${props.page.slug}`, { replace: true })}
        >
          <FiArrowLeft /> Back
        </Button>
        <Void />
        <Button fill="clear" onClick={() => setIsMediaOpen(true)}>
          <FiImage /> Media
        </Button>
        <Button fill="clear" onClick={props.onSave}>
          <FiSave /> Save
        </Button>
        <Void />
        <Button fill="clear" onClick={() => setIsEditorOpen(true)}>
          <FiSettings /> Configure
        </Button>
      </Toolbar>
    </>
  ) : null;
}
