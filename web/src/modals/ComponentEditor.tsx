import axios from "axios";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { LabelWithError } from "../components/Label";
import { Modal } from "../components/Modal";
import type { Component } from "../interfaces";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { FiCheck } from "react-icons/fi";
import * as yup from "yup";

const validationSchema = yup.object({
  tag: yup
    .string()
    .required("Tag is required")
    .matches(
      /^[A-Z][a-zA-Z0-9-]*$/,
      "Tag must start with an uppercase letter and contain only letters, numbers, and hyphens"
    )
    .min(3, "Tag must be at least 3 characters")
    .max(255, "Tag must be at most 255 characters"),
});

export function ComponentEditorModal(props: {
  component?: Component | null;
  onClose: () => void;
  isOpen: boolean;
}) {
  const formik = useFormik({
    initialValues: {
      tag: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (props.component) {
        try {
          await axios.patch(`/api/components/${props.component.id}`, {
            tag: values.tag,
          });
          props.onClose();
          toast.success("Component updated successfully");
        } catch (error) {
          toast.error("Unable to update your component");
        }
      } else {
        try {
          const { data } = await axios.post("/api/components", {
            tag: values.tag,
          });
          window.open(`/editor/components/${data.id}`, "_blank");
        } catch (error) {
          toast.error("Unable to create your component");
        }
      }
    },
  });

  useEffect(() => {
    if (props.component) {
      formik.setValues({ tag: props.component.tag });
    }
  }, [props.component]);

  return (
    <Modal
      title={props.component ? "Edit Component" : "Create Component"}
      onClose={props.onClose}
      isOpen={props.isOpen}
    >
      <Form onSubmit={formik.handleSubmit}>
        <LabelWithError error={formik.touched.tag && formik.errors.tag ? formik.errors.tag : undefined}>
          Tag
          <Input
            name="tag"
            value={formik.values.tag}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </LabelWithError>
        <Button type="submit" fill="solid">
          <FiCheck />
          {props.component ? "Edit" : "Create"}
        </Button>
      </Form>
    </Modal>
  );
}
