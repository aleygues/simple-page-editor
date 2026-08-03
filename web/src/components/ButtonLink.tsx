import { styled } from "@linaria/react";
import { Link } from "react-router";

export const ButtonLink = styled(Link)<{ fill?: "clear" | "solid" }>`
  display: flex;
  flex-direction: row;
  gap: var(--gap);
  text-decoration: none;
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
  line-height: normal;

  svg {
    width: calc(var(--input-font-size) * 1.1);
    height: calc(var(--input-font-size) * 1.1);
  }

  &:hover,
  &:focus {
    background-color: var(--input-hover-background-color);
  }
`;
