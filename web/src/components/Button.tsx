import { styled } from "@linaria/react";

export const Button = styled.button<{ fill?: "clear" | "solid" }>`
  display: flex;
  flex-direction: row;
  gap: var(--gap);
  border: ${({ fill }) =>
    fill === "solid" ? "1px solid var(--button-background-color)" : "none"};
  background-color: ${({ fill }) =>
    fill === "solid" ? "var(--button-background-color)" : "transparent"};
  color: ${({ fill }) =>
    fill === "solid" ? "var(--button-color)" : "var(--button-color)"};
  border-radius: var(--input-border-radius);
  padding: var(--input-padding);
  cursor: pointer;
  font-family: var(--input-font-family);
  font-size: var(--input-font-size);

  svg {
    width: calc(var(--input-font-size) * 1.1);
    height: calc(var(--input-font-size) * 1.1);
  }

  &:hover,
  &:focus {
    background-color: var(--button-hover-background-color);
  }
`;
