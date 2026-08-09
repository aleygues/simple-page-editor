import { styled } from "@linaria/react";

export const Toolbar = styled.div`
  height: 58px;
  max-height: 58px;
  width: 100%;
  flex-shrink: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 0px var(--padding);
  gap: var(--gap);
  box-sizing: border-box;
`;
