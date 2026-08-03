import { styled } from "@linaria/react";

export const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: var(--input-border-radius);
  padding: var(--input-padding);
  font-family: var(--input-font-family);
  font-size: var(--input-font-size);
  background-color: var(--input-background-color);
  color: var(--input-color);

  &:hover,
  &:focus {
    background-color: var(--input-hover-background-color);
  }
`;
