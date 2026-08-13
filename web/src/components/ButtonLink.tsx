import { styled } from "@linaria/react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router";

const Component = styled(Link)<{
  fill?: "clear" | "solid";
  isActive?: "true" | undefined;
}>`
  display: flex;
  flex-direction: row;
  gap: var(--gap);
  text-decoration: none;
  border: ${({ fill }) =>
    fill === "solid" ? "1px solid var(--button-background-color)" : "none"};
  background-color: ${({ fill }) =>
    fill === "solid" ? "var(--button-background-color)" : "transparent"};
  color: var(--button-color);
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
  &:focus,
  &[isActive="true"] {
    background-color: var(--input-hover-background-color);
    color: var(--button-color) !important;
  }
`;

export function ButtonLink(props: {
  to: string;
  children: React.ReactNode;
  fill?: "clear" | "solid";
  notActive?: boolean;
}) {
  const location = useLocation();

  const isActive = useMemo(() => {
    const url = new URL(props.to, window.location.origin);
    return (
      !props.notActive &&
      props.to.startsWith("/") &&
      location.pathname === url.pathname
    );
  }, [location.pathname, props.to, props.notActive]);

  return (
    <Component
      to={props.to}
      fill={props.fill}
      isActive={isActive ? "true" : undefined}
    >
      {props.children}
    </Component>
  );
}
