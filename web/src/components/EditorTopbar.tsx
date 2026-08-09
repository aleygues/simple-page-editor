import {
  FiArrowLeft,
  FiBook,
  FiImage,
  FiSave,
  FiSettings,
  FiX,
} from "react-icons/fi";
import { useMe } from "../hooks/me.hook";
import { Toolbar } from "./Toolbar";
import { Void } from "./Void";
import type { Component, Media, Page } from "../interfaces";
import { Button } from "./Button";
import { PageEditorModal } from "../modals/PageEditor";
import { useState } from "react";
import { MediaModal } from "../modals/Media";
import { useNavigate } from "react-router";
import { ComponentsModal } from "../modals/Components";
import { ComponentEditorModal } from "../modals/ComponentEditor";

export function EditorTopbar(props: {
  page?: Page;
  component?: Component;
  onSave: () => void;
  onMediaSelect?: (media: Media) => void;
  onComponentSelect?: (component: Component) => void;
}) {
  const { me } = useMe();
  const navigate = useNavigate();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isComponentsOpen, setIsComponentsOpen] = useState(false);

  return me ? (
    <>
      {props.page && (
        <PageEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          page={props.page}
        />
      )}
      {props.component && (
        <ComponentEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          component={props.component}
        />
      )}
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
      <ComponentsModal
        isOpen={isComponentsOpen}
        onClose={() => setIsComponentsOpen(false)}
        onComponentSelect={(component) => {
          setIsComponentsOpen(false);
          if (props.onComponentSelect) {
            props.onComponentSelect(component);
          }
        }}
      />
      <Toolbar className="dark">
        {props.page && (
          <Button
            fill="clear"
            onClick={() => navigate(`/${props.page?.slug}`, { replace: true })}
          >
            <FiArrowLeft /> Back
          </Button>
        )}
        {props.component && (
          <Button fill="clear" onClick={() => window.close()}>
            <FiX /> Close
          </Button>
        )}
        <Void />
        <Button fill="clear" onClick={() => setIsMediaOpen(true)}>
          <FiImage /> Media
        </Button>
        <Button fill="clear" onClick={() => setIsComponentsOpen(true)}>
          <FiBook /> Components
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
