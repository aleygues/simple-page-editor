import axios from "axios";
import { Modal } from "../components/Modal";
import type { Component, Page } from "../interfaces";
import { useEffect, useState } from "react";
import { Row } from "../components/Row";
import { Section } from "../components/Section";
import { format } from "date-fns";
import { Button } from "../components/Button";
import { FiCheck, FiEdit, FiPlus } from "react-icons/fi";
import { Void } from "../components/Void";
import { ComponentEditorModal } from "./ComponentEditor";

export function ComponentsModal(props: {
  page?: Page | null;
  onClose: () => void;
  isOpen: boolean;
  onComponentSelect?: (component: Component) => void;
}) {
  const [components, setComponents] = useState<Component[]>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  async function refetch() {
    const { data } = await axios.get<Component[]>("/api/components");
    setComponents(data);
  }

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <ComponentEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        component={null}
      />
      <Modal
        title={"Components"}
        onClose={props.onClose}
        isOpen={props.isOpen}
        buttons={
          <Button onClick={() => setIsEditorOpen(true)} fill="clear">
            <FiPlus /> Add
          </Button>
        }
      >
        <Section>
          {components && components?.length === 0 && <p>No components found</p>}
          {components?.map((component) => (
            <Row>
              <div>
                <h3>{component.tag}</h3>
                <p>
                  Created by {component.createdBy.email} on{" "}
                  {format(new Date(component.createdAt), "PPP")}
                </p>
              </div>
              <Void />
              <Button
                fill="clear"
                onClick={() => {
                  if (props.onComponentSelect) {
                    props.onComponentSelect(component);
                  }
                }}
              >
                <FiCheck />
                Use
              </Button>
              <Button
                fill="clear"
                onClick={() =>
                  window.open(`/editor/components/${component.id}`, "_blank")
                }
              >
                <FiEdit />
                Edit
              </Button>
            </Row>
          ))}
        </Section>
      </Modal>
    </>
  );
}
