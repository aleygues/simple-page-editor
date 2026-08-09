import axios from "axios";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { Modal } from "../components/Modal";
import type { Component } from "../interfaces";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

export function ComponentEditorModal(props: {
  component?: Component | null;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [tag, setTag] = useState("");

  async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (props.component) {
      try {
        await axios.patch(`/api/components/${props.component.id}`, {
          tag,
        });
        props.onClose();
        toast.success("Component updated successfully");
      } catch (error) {
        toast.error("Unable to update your component");
      }
    } else {
      try {
        const { data } = await axios.post("/api/components", {
          tag,
        });
        window.open(`/editor/components/${data.id}`, "_blank");
      } catch (error) {
        toast.error("Unable to create your component");
      }
    }
  }

  useEffect(() => {
    if (props.component) {
      setTag(props.component.tag);
    }
  }, [props.component]);

  return (
    <Modal
      title={props.component ? "Edit Component" : "Create Component"}
      onClose={props.onClose}
      isOpen={props.isOpen}
    >
      <Form onSubmit={onSubmit}>
        <Label>
          Tag
          <Input
            name="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </Label>
        <Button type="submit" fill="solid">
          <FiCheck />
          {props.component ? "Edit" : "Create"}
        </Button>
      </Form>
    </Modal>
  );
}
