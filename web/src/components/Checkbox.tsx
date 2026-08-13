import { styled } from "@linaria/react";

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: var(--input-label-gap);
  width: 100%;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;
