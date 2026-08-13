import { styled } from "@linaria/react";
import { FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Row } from "./Row";

const ToolbarContainer = styled.div<{ isMobile: boolean; isOpen: boolean }>`
  height: ${({ isMobile, isOpen }) => isMobile && isOpen ? "auto" : "58px"};
  max-height: ${({ isMobile, isOpen }) => isMobile && isOpen ? "none" : "58px"};
  width: 100%;
  flex-shrink: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  display: flex;
  align-items: center;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
  padding: ${({ isMobile }) => (isMobile ? "var(--gap)" : "0px var(--padding)")};
  gap: var(--gap);
  box-sizing: border-box;
  overflow: ${({ isMobile, isOpen }) => (isMobile && !isOpen ? "hidden" : "visible")};
  transition: max-height 0.3s ease-out, overflow 0.3s ease-out;
`;

const MobileToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  padding: var(--gap);
  
  svg {
    width: calc(var(--input-font-size) * 1.5);
    height: calc(var(--input-font-size) * 1.5);
  }
  
  &:hover {
    background-color: var(--input-hover-background-color);
    border-radius: var(--input-border-radius);
  }
`;

const ChildrenContainer = styled.div<{ isMobile: boolean; isOpen: boolean }>`
  width: 100%;
  opacity: ${({ isMobile, isOpen }) => (isMobile && !isOpen ? "0" : "1")};
  visibility: ${({ isMobile, isOpen }) => (isMobile && !isOpen ? "hidden" : "visible")};
  transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
`;

export function Toolbar(props: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Consider mobile if screen width is less than 768px (typical tablet breakpoint)
      setIsMobile(window.innerWidth < 768);
      // If we're switching from mobile to desktop, make sure the toolbar is open
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // If we switch to mobile, start closed
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  return (
    <ToolbarContainer isMobile={isMobile} isOpen={isOpen} className={props.className}>
      {isMobile && (
        <MobileToggleButton 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </MobileToggleButton>
      )}
      <ChildrenContainer isMobile={isMobile} isOpen={isOpen || !isMobile}>
        <Row autoColumn>{props.children}</Row>
      </ChildrenContainer>
    </ToolbarContainer>
  );
}
