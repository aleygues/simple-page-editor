import { styled } from "@linaria/react";

export const CenteredContainer = styled.div`
  max-width: var(--max-width);
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  padding: var(--padding);
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: var(--border-radius);
`;
