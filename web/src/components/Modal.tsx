import { styled } from "@linaria/react";
import { Row } from "./Row";
import { Void } from "./Void";
import { Button } from "./Button";
import { FiX } from "react-icons/fi";

const Blank = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1010;

  width: 600px;
  max-width: 100%;
  height: 400px;
  max-height: 100%;

  padding: var(--padding);
  background-color: var(--container-background-color);
  color: var(--text-color);
  border-radius: var(--border-radius);
`;

const ScrollContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
`;

export function Modal(props: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  isOpen: boolean;
}) {
  if (props.isOpen) {
    return (
      <>
        <Blank />
        <Container className="dark">
          <Row>
            <h2>{props.title}</h2>
            <Void />
            <Button onClick={props.onClose}>
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
