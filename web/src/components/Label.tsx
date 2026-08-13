import { styled } from "@linaria/react";
import type { ReactNode } from "react";

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: var(--input-label-gap);
  width: 100%;
`;

export const ErrorMessage = styled.span`
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export function LabelWithError(
  props: {
    children: ReactNode;
    error?: string;
  }
) {
  return (
    <Label>
      {props.children}
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </Label>
  );
}
