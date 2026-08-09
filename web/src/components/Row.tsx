import { styled } from "@linaria/react";

type Props = {
  center?: boolean;
};

export const Row = styled.div<Props>`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: var(--gap);
  align-items: center;
  justify-content: ${({ center }) => (center ? "center" : "flex-start")};
`;
