import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import { FiAlertTriangle, FiCheck, FiX } from "react-icons/fi";

export function UnsavedChangesModal(props: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      title="Unsaved Changes"
      onClose={props.onClose}
      isOpen={props.isOpen}
      buttons={
        <>
          <Button fill="solid" onClick={props.onConfirm}>
            <FiCheck />
            Leave
          </Button>
          <Button fill="clear" onClick={props.onClose}>
            <FiX />
            Cancel
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap)" }}>
        <FiAlertTriangle
          style={{
            width: "48px",
            height: "48px",
            color: "var(--warning-color, #ff9800)",
          }}
        />
        <p style={{ textAlign: "center" }}>
          You have unsaved changes. Are you sure you want to leave without saving?
        </p>
      </div>
    </Modal>
  );
}
