import { styled } from "@linaria/react";

type Props = {
  fullscreen?: boolean;
};

export const Main = styled.main<Props>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  align-items: flex-start;
  justify-content: stretch;
  margin: auto;
  max-width: var(--max-width);
  padding: var(--padding);
`;
