import { styled } from "@linaria/react";

export const Select = styled.select<{ fill?: "clear" | "solid" }>`
  border: ${({ fill }) => (fill === "solid" ? "1px solid #ccc" : "none")};
  background-color: ${({ fill }) =>
    fill === "solid" ? "var(--input-background-color)" : "transparent"};
  border-radius: var(--input-border-radius);
  padding: var(--input-padding);
  font-family: var(--input-font-family);
  font-size: var(--input-font-size);
  color: var(--button-background-color);

  &:hover,
  &:focus {
    background-color: var(--input-hover-background-color);
  }
`;
