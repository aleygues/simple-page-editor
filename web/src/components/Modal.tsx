import { styled } from "@linaria/react";
import { Row } from "./Row";
import { Void } from "./Void";
import { Button } from "./Button";
import { FiX } from "react-icons/fi";
import { useEffect, useMemo } from "react";

const Blank = styled.div<{ index: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ index }) => 1000 + index * 10};
`;

const Container = styled.div<{ index: number }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: ${({ index }) => 1005 + index * 10};

  width: 600px;
  max-width: 100%;
  height: auto;
  max-height: 100%;

  padding: var(--padding);
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: var(--border-radius);
`;

const ScrollContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  overflow: auto;
  height: 100%;
`;

export function Modal(props: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  isOpen: boolean;
  buttons?: React.ReactNode;
}) {
  const index = useMemo(
    () => document.querySelectorAll("body .modal").length,
    [props.isOpen],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        index === document.querySelectorAll("body .modal").length - 1
      ) {
        props.onClose();
      }
    }

    if (props.isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, props.onClose]);

  if (props.isOpen) {
    return (
      <>
        <Blank index={index} />
        <Container index={index} className="modal">
          <Row>
            <h2>{props.title}</h2>
            <Void />
            {props.buttons}
            <Button onClick={props.onClose} fill="clear">
              <FiX />
              Close
            </Button>
          </Row>
          <ScrollContent>{props.children}</ScrollContent>
        </Container>
      </>
    );
  } else {
    return null;
  }
}
