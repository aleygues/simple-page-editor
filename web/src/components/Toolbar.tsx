import { styled } from "@linaria/react";

export const Toolbar = styled.div`
  height: 58px;
  max-height: 58px;
  width: 100%;
  background-color: var(--toolbar-background-color);
  color: var(--toolbar-text-color);
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 0px var(--padding);
  gap: var(--gap);
  box-sizing: border-box;
`;
