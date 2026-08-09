import axios from "axios";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { Modal } from "../components/Modal";
import type { Page } from "../interfaces";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

export function PageEditorModal(props: {
  page?: Page | null;
  onClose: () => void;
  isOpen: boolean;
}) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (props.page) {
      try {
        await axios.patch(`/api/pages/${props.page.id}`, {
          title,
          slug,
          description,
        });
        props.onClose();
        toast.success("Page updated successfully");
      } catch (error) {
        toast.error("Unable to update your page");
      }
    } else {
      try {
        const { data } = await axios.post("/api/pages", {
          title,
          slug,
          description,
        });
        navigate(`/editor/${data.id}`);
      } catch (error) {
        toast.error("Unable to create your page");
      }
    }
  }

  useEffect(() => {
    if (props.page) {
      setTitle(props.page.title);
      setSlug(props.page.slug);
      setDescription(props.page.description);
    }
  }, [props.page]);

  return (
    <Modal
      title={props.page ? "Edit Page" : "Create Page"}
      onClose={props.onClose}
      isOpen={props.isOpen}
    >
      <Form onSubmit={onSubmit}>
        <Label>
          Title
          <Input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Label>
        <Label>
          Slug
          <Input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </Label>
        <Label>
          Description
          <Input
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Label>
        <Button type="submit" fill="solid">
          <FiCheck />
          {props.page ? "Edit" : "Create"}
        </Button>
      </Form>
    </Modal>
  );
}
