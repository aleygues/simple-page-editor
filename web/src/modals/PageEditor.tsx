import axios from "axios";
import { Button } from "../components/Button";
import { Checkbox, CheckboxContainer } from "../components/Checkbox";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { LabelWithError } from "../components/Label";
import { Modal } from "../components/Modal";
import type { Page } from "../interfaces";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { FiCheck } from "react-icons/fi";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  slug: yup.string().required("Slug is required"),
  description: yup.string().required("Description is required"),
});

export function PageEditorModal(props: {
  page?: Page | null;
  onClose: () => void;
  isOpen: boolean;
}) {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      description: "",
      inSitemap: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (props.page) {
        try {
          await axios.patch(`/api/pages/${props.page.id}`, {
            title: values.title,
            slug: values.slug,
            description: values.description,
            inSitemap: values.inSitemap,
          });
          props.onClose();
          toast.success("Page updated successfully");
        } catch (error) {
          toast.error("Unable to update your page");
        }
      } else {
        try {
          const { data } = await axios.post("/api/pages", {
            title: values.title,
            slug: values.slug,
            description: values.description,
            inSitemap: values.inSitemap,
          });
          navigate(`/editor/${data.id}`);
        } catch (error) {
          toast.error("Unable to create your page");
        }
      }
    },
  });

  useEffect(() => {
    if (props.page) {
      formik.setValues({
        title: props.page.title,
        slug: props.page.slug,
        description: props.page.description,
        inSitemap: props.page.inSitemap,
      });
    }
  }, [props.page]);

  return (
    <Modal
      title={props.page ? "Edit Page" : "Create Page"}
      onClose={props.onClose}
      isOpen={props.isOpen}
    >
      <Form onSubmit={formik.handleSubmit}>
        <LabelWithError error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}>
          Title
          <Input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </LabelWithError>
        <LabelWithError error={formik.touched.slug && formik.errors.slug ? formik.errors.slug : undefined}>
          Slug
          <Input
            name="slug"
            value={formik.values.slug}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </LabelWithError>
        <LabelWithError error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}>
          Description
          <Input
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </LabelWithError>
        <CheckboxContainer>
          Include in sitemap
          <Checkbox
            name="inSitemap"
            checked={formik.values.inSitemap}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </CheckboxContainer>
        <Button type="submit" fill="solid">
          <FiCheck />
          {props.page ? "Edit" : "Create"}
        </Button>
      </Form>
    </Modal>
  );
}
